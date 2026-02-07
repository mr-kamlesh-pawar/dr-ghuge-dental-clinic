import { NextResponse } from "next/server";
import { 
  createDocument, 
  listDocuments, 
  updateDocument, 
  deleteDocument,
  Query 
} from "@/lib/appwrite";

const COLLECTION_ID = process.env.APPWRITE_COLLECTION_APPOINTMENTS;

// Enhanced logging function
const log = (step, data = {}, isError = false) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    step,
    collectionId: COLLECTION_ID,
    ...data
  };
  
  if (isError) {
    console.error(`[APPOINTMENTS_API] [ERROR] ${step}:`, logEntry);
  } else if (process.env.NODE_ENV === 'development') {
    console.log(`[APPOINTMENTS_API] ${step}:`, logEntry);
  }
  
  return logEntry;
};

// Validation function
const validateAppointmentData = (data) => {
  const errors = [];
  
  const requiredFields = ['patient_name', 'phone', 'service', 'appointment_date', 'appointment_time', 'clinic', 'email'];
  
  requiredFields.forEach(field => {
    if (!data[field] || data[field].toString().trim() === '') {
      errors.push(`${field.replace('_', ' ')} is required`);
    }
  });

  // Phone validation (more flexible)
  if (data.phone) {
    const cleanPhone = data.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      errors.push('Phone number must be at least 10 digits');
    }
  }

  // Email validation if provided
  if (data.email && data.email.trim() !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      errors.push('Invalid email format');
    }
  }

  // Date validation
  if (data.appointment_date) {
    const appointmentDate = new Date(data.appointment_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (appointmentDate < today) {
      errors.push('Appointment date cannot be in the past');
    }
  }

  return errors;
};

// Helper function to generate appointment ID
const generateAppointmentId = (clinic, phone) => {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  const cleanPhone = phone.replace(/\D/g, '');
  const phoneSuffix = cleanPhone.slice(-4);
  const clinicCode = clinic?.slice(0, 3).toUpperCase() || 'CLN';
  const dateCode = new Date().getDate().toString().padStart(2, '0');
  
  return `${clinicCode}-${dateCode}${phoneSuffix}-${rand}`;
};

// Helper function to format date for search
const formatDateForSearch = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch (error) {
    return dateString;
  }
};

export async function GET(request) {
  log('GET_REQUEST_START', { 
    url: request.url,
    method: 'GET',
    hasCollectionId: !!COLLECTION_ID
  });

  try {
    if (!COLLECTION_ID) {
      const errorMsg = 'Server configuration error: APPWRITE_COLLECTION_APPOINTMENTS not found';
      log('GET_MISSING_COLLECTION_ID', { error: errorMsg }, true);
      return NextResponse.json(
        { 
          success: false, 
          error: errorMsg 
        }, 
        { status: 500 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const date = searchParams.get('date');
    const limit = parseInt(searchParams.get('limit')) || 10;
    const page = parseInt(searchParams.get('page')) || 1;
    const search = searchParams.get('search');
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');
    
    const offset = (page - 1) * limit;
    
    log('GET_QUERY_PARAMS', { 
      status, 
      date, 
      limit, 
      page, 
      offset, 
      search,
      email,
      phone 
    });

    // Build queries
    const queries = [
      Query.orderDesc('$createdAt'),
      Query.limit(limit),
      Query.offset(offset)
    ];

    // Status filter
    if (status && status !== 'All' && status !== 'all') {
      queries.push(Query.equal('status', status));
    }

    // Date filter - IMPROVED HANDLING
    if (date) {
      try {
        // Parse the incoming date (likely YYYY-MM-DD format)
        const inputDate = new Date(date);
        if (isNaN(inputDate.getTime())) {
          throw new Error('Invalid date format');
        }
        
        // Format date in the same way as stored in database
        const formattedDate = inputDate.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        
        log('DATE_FILTER_APPLIED', { 
          original: date, 
          formatted: formattedDate,
          inputDate: inputDate.toISOString()
        });
        
        // Instead of Query.search, use Query.contains which works better for date strings
        // Or if Query.search doesn't work, fetch all and filter client-side
        queries.push(Query.search('preferred_date', formattedDate));
        
      } catch (dateError) {
        log('DATE_FILTER_ERROR', { 
          error: dateError.message,
          date
        }, true);
        // Don't fail the whole request if date filter is invalid
        // Just ignore the date filter
      }
    }

    // Search filter (name, email, phone, or appointment_id)
    if (search && search.trim() !== '') {
      const searchTerm = search.trim();
      // Search in multiple fields using OR
      // Build search queries based on input type
      // Note: 'appointment_id' is not an indexed attribute, so we can't search on it directly with Query.search/Query.equal unless it's indexed.
      // We will search by name by default.
      
      const searchQueries = [
        Query.search('name', searchTerm)
      ];
      
      // Add phone search if it looks like a phone number
      if (/^\d+$/.test(searchTerm)) {
        searchQueries.push(Query.search('phone', searchTerm));
      }
      
      // Add email search if it looks like an email
      if (searchTerm.includes('@')) {
        searchQueries.push(Query.search('email', searchTerm));
      }
      
      queries.push(Query.or(searchQueries));
    }

    // Email filter
    if (email) {
      queries.push(Query.equal('email', email));
    }

    // Phone filter
    if (phone) {
      const cleanPhone = phone.replace(/\D/g, '');
      queries.push(Query.search('phone', cleanPhone));
    }

    log('GET_FETCHING_DOCUMENTS', { 
      collectionId: COLLECTION_ID,
      queryCount: queries.length,
      queries: queries.map(q => {
        try {
          return q.toString();
        } catch {
          return 'Cannot stringify query';
        }
      })
    });

    let documents, total;
    try {
      const result = await listDocuments(COLLECTION_ID, queries);
      documents = result.documents;
      total = result.total;
    } catch (queryError) {
      log('QUERY_EXECUTION_ERROR', {
        error: queryError.message,
        code: queryError.code,
        type: queryError.type
      }, true);
      
      // If query fails, try without complex queries
      const simpleQueries = [
        Query.orderDesc('$createdAt'),
        Query.limit(limit),
        Query.offset(offset)
      ];
      
      const simpleResult = await listDocuments(COLLECTION_ID, simpleQueries);
      documents = simpleResult.documents;
      total = simpleResult.total;
      
      log('USING_SIMPLE_QUERY', { count: documents.length });
    }
    
    log('GET_DOCUMENTS_FETCHED', { 
      documentCount: documents.length,
      total,
      collectionId: COLLECTION_ID
    });

    // Transform documents with proper field mapping
    let appointments = documents.map(doc => ({
      id: doc.$id,
      name: doc.name || '',
      phone: doc.phone || '',
      email: doc.email || '',
      service_name: doc.service_name || '',
      preferred_date: doc.preferred_date || '',
      preferred_time: doc.preferred_time || '',
      status: doc.status || 'Pending',
      notes: doc.notes || '',
      appointment_id: doc.appointment_id || '',
      at: doc.at || '',
      createdAt: doc.$createdAt,
      updatedAt: doc.$updatedAt,
      created_at: doc.created_at || doc.$createdAt // Fallback
    }));

    // Apply client-side date filtering if needed
    if (date && appointments.length > 0) {
      try {
        const inputDate = new Date(date);
        inputDate.setHours(0, 0, 0, 0);
        
        appointments = appointments.filter(appointment => {
          if (!appointment.preferred_date) return false;
          
          try {
            // Try to parse the stored date format
            // The format is typically "12 Feb 2024, 10:00 am"
            const dateStr = appointment.preferred_date.split(',')[0]; // Get "12 Feb 2024"
            const appointmentDate = new Date(dateStr);
            
            if (isNaN(appointmentDate.getTime())) {
              // If parsing fails, try alternative
              return appointment.preferred_date.includes(date) || 
                     appointment.preferred_date.includes(inputDate.toLocaleDateString("en-IN", {
                       day: "2-digit",
                       month: "short",
                       year: "numeric"
                     }));
            }
            
            appointmentDate.setHours(0, 0, 0, 0);
            return appointmentDate.getTime() === inputDate.getTime();
          } catch {
            // If all parsing fails, do string comparison
            return appointment.preferred_date.includes(inputDate.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric"
            }));
          }
        });
        
        log('CLIENT_SIDE_DATE_FILTER', {
          originalCount: documents.length,
          filteredCount: appointments.length,
          dateFilter: date
        });
      } catch (filterError) {
        log('CLIENT_FILTER_ERROR', {
          error: filterError.message,
          date
        }, true);
        // Keep all appointments if client-side filtering fails
      }
    }

    // Get count by status for statistics
    const statusCounts = {
      Pending: 0,
      Confirmed: 0,
      Completed: 0,
      Cancelled: 0,
      'No Show': 0
    };

    appointments.forEach(apt => {
      if (statusCounts[apt.status] !== undefined) {
        statusCounts[apt.status]++;
      }
    });

    log('GET_RESPONSE_PREPARED', { 
      appointmentCount: appointments.length 
    });

    return NextResponse.json({ 
      success: true, 
      data: appointments,
      meta: {
        total: appointments.length, // Use filtered count for pagination
        page,
        limit,
        totalPages: Math.ceil((date ? appointments.length : total) / limit),
        hasNextPage: page < Math.ceil((date ? appointments.length : total) / limit),
        hasPrevPage: page > 1,
        statusCounts,
        filters: { 
          status, 
          date, 
          search,
          email,
          phone
        }
      }
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error) {
    log('GET_REQUEST_ERROR', {
      error: error.message,
      errorCode: error.code,
      errorType: error.type,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, true);
    
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch appointments",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        data: [],
        meta: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
          statusCounts: {},
          filters: {}
        }
      }, 
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const startTime = Date.now();
  log('POST_REQUEST_START', { 
    method: 'POST',
    hasCollectionId: !!COLLECTION_ID,
    timestamp: new Date().toISOString()
  });

  try {
    // Check collection ID
    if (!COLLECTION_ID) {
      const errorMsg = 'Server configuration error: APPWRITE_COLLECTION_APPOINTMENTS not found';
      log('POST_MISSING_COLLECTION_ID', { error: errorMsg }, true);
      return NextResponse.json(
        { 
          success: false, 
          error: errorMsg 
        },
        { status: 500 }
      );
    }

    // Parse request body
    let requestBody;
    try {
      requestBody = await request.json();
      log('POST_REQUEST_BODY_PARSED', {
        bodyKeys: Object.keys(requestBody),
        hasEmail: !!requestBody.email,
        bodySample: {
          patient_name: requestBody.patient_name?.substring(0, 20) + '...',
          phone: requestBody.phone,
          service: requestBody.service
        }
      });
    } catch (parseError) {
      log('POST_REQUEST_BODY_PARSE_ERROR', {
        error: parseError.message,
        contentType: request.headers.get('content-type')
      }, true);
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid JSON in request body" 
        },
        { status: 400 }
      );
    }

    const {
      patient_name,
      phone,
      email,
      service,
      appointment_date,
      appointment_time,
      clinic,
      notes,
    } = requestBody;

    log('POST_REQUEST_FIELDS_EXTRACTED', {
      hasPatientName: !!patient_name,
      hasPhone: !!phone,
      hasService: !!service,
      hasAppointmentDate: !!appointment_date,
      hasAppointmentTime: !!appointment_time,
      hasClinic: !!clinic
    });

    // Validate required fields
    const validationErrors = validateAppointmentData(requestBody);
    if (validationErrors.length > 0) {
      log('POST_VALIDATION_FAILED', {
        errors: validationErrors,
        providedData: requestBody
      }, true);
      
      return NextResponse.json(
        { 
          success: false,
          error: validationErrors[0], // Return the first error as the main error message
          errors: validationErrors 
        },
        { status: 400 }
      );
    }

    log('POST_VALIDATION_PASSED');

    // Format date
    let cleanDate;
    try {
      const dateObj = new Date(appointment_date);
      if (isNaN(dateObj.getTime())) {
        throw new Error('Invalid date');
      }
      cleanDate = dateObj.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      log('POST_DATE_FORMATTED', { original: appointment_date, formatted: cleanDate });
    } catch (dateError) {
      log('POST_DATE_FORMATTING_ERROR', { 
        error: dateError.message,
        appointment_date 
      }, true);
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid appointment date format" 
        },
        { status: 400 }
      );
    }

    // Generate unique appointment ID
    const appointmentId = generateAppointmentId(clinic, phone);
    const cleanPhone = phone.replace(/\D/g, '');
    
    log('POST_APPOINTMENT_ID_GENERATED', { appointmentId });

    // Map to Appwrite document structure
    const payload = {
      name: patient_name.trim(),
      phone: cleanPhone,
      email: email ? email.trim().toLowerCase() : null,
      service_name: service.trim(),
      preferred_date: cleanDate,
      preferred_time: appointment_time,
      status: "Pending",
      notes: notes ? notes.trim() : null,
      at: clinic.trim()
    };

    log('POST_PAYLOAD_PREPARED', {
      payloadKeys: Object.keys(payload),
      payloadSample: {
        name: payload.name.substring(0, 10) + '...',
        phone: '***' + payload.phone.slice(-3),
        service_name: payload.service_name,
        service_name: payload.service_name
      }
    });

    // Create document
    log('POST_CREATING_DOCUMENT', {
      collectionId: COLLECTION_ID,
      timestamp: new Date().toISOString()
    });

    const newDoc = await createDocument(COLLECTION_ID, payload);
    
    const duration = Date.now() - startTime;
    
    log('POST_DOCUMENT_CREATED', {
      documentId: newDoc.$id,
      appointmentId: newDoc.appointment_id,
      createdAt: newDoc.$createdAt,
      duration: `${duration}ms`,
      success: true
    });

    const responseData = {
      success: true,
      data: { 
        ...newDoc, 
        id: newDoc.$id 
      },
      message: "Appointment booked successfully",
      confirmation: {
        id: appointmentId,
        reference: newDoc.$id,
        date: cleanDate,
        time: appointment_time,
        clinic: clinic
      }
    };

    return NextResponse.json(responseData, { status: 201 });

  } catch (error) {
    const duration = Date.now() - startTime;
    
    log('POST_REQUEST_ERROR', {
      error: error.message,
      errorCode: error.code,
      errorType: error.type,
      duration: `${duration}ms`,
      collectionId: COLLECTION_ID,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, true);

    // Provide more specific error messages
    let userMessage = "Failed to book appointment. Please try again.";
    let statusCode = 500;

    if (error.code === 401 || error.code === 403) {
      userMessage = "Authentication error. Please contact support.";
      statusCode = 401;
    } else if (error.code === 404) {
      userMessage = "Collection not found. Configuration error.";
      statusCode = 500;
    } else if (error.code === 429) {
      userMessage = "Too many requests. Please try again later.";
      statusCode = 429;
    }

    return NextResponse.json(
      { 
        success: false,
        error: userMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: statusCode }
    );
  }
}

export async function PUT(request) {
  log('PUT_REQUEST_START', { 
    method: 'PUT',
    hasCollectionId: !!COLLECTION_ID 
  });

  try {
    if (!COLLECTION_ID) {
      const errorMsg = 'Server configuration error: APPWRITE_COLLECTION_APPOINTMENTS not found';
      log('PUT_MISSING_COLLECTION_ID', { error: errorMsg }, true);
      return NextResponse.json(
        { 
          success: false, 
          error: errorMsg 
        },
        { status: 500 }
      );
    }

    let requestBody;
    try {
      requestBody = await request.json();
      log('PUT_REQUEST_BODY_PARSED', { body: requestBody });
    } catch (parseError) {
      log('PUT_REQUEST_BODY_PARSE_ERROR', { error: parseError.message }, true);
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid JSON in request body" 
        },
        { status: 400 }
      );
    }

    const { id, newStatus } = requestBody;
    
    log('PUT_REQUEST_DATA_EXTRACTED', { id, newStatus });

    if (!id) {
      log('PUT_MISSING_ID', { requestBody }, true);
      return NextResponse.json(
        { 
          success: false,
          error: "Missing appointment ID" 
        },
        { status: 400 }
      );
    }

    if (!newStatus) {
      log('PUT_MISSING_STATUS', { requestBody }, true);
      return NextResponse.json(
        { 
          success: false,
          error: "Missing new status" 
        },
        { status: 400 }
      );
    }

    const validStatuses = ['Pending', 'Confirmed', 'Cancelled', 'Completed', 'No Show'];
    if (!validStatuses.includes(newStatus)) {
      log('PUT_INVALID_STATUS', { 
        providedStatus: newStatus,
        validStatuses 
      }, true);
      return NextResponse.json(
        { 
          success: false,
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
        },
        { status: 400 }
      );
    }

    log('PUT_UPDATING_DOCUMENT', { 
      collectionId: COLLECTION_ID,
      documentId: id,
      newStatus 
    });

    let updatedDoc;
    try {
        updatedDoc = await updateDocument(COLLECTION_ID, id, {
          status: newStatus,
         // updated_at: new Date().toISOString()
        });
    } catch (e) {
        // If direct update failed (likely 404), check if the ID passed was actually 'appointment_id' (custom ID)
        // Note: appointment_id is not indexed by default, so we might need to fetch all -> filter, 
        // OR better: ensure frontend sends the system ID ($id).
        // Since we refactored frontend to use 'id' ($id), this catch block handles edge cases.
        
        if (e.code === 404) {
            // Try to find by appointment_id field (fallback)
            // This requires appointment_id to be an attribute. If not indexed, we must list & filter.
             const { documents } = await listDocuments(COLLECTION_ID, [
                Query.limit(100),
                Query.orderDesc('$createdAt')
             ]);
             
             const found = documents.find(d => d.appointment_id === id);
             
             if (!found) {
                 throw new Error("Appointment not found");
             }
            
            updatedDoc = await updateDocument(COLLECTION_ID, found.$id, {
                status: newStatus,
            });
        } else {
            throw e;
        }
    }

    log('PUT_DOCUMENT_UPDATED', {
      documentId: updatedDoc.$id,
      oldStatus: updatedDoc.status,
      newStatus,
      updatedAt: updatedDoc.$updatedAt
    });

    return NextResponse.json({
      success: true,
      message: "Status updated successfully",
      data: {
        id: updatedDoc.$id,
        status: updatedDoc.status,
        updatedAt: updatedDoc.$updatedAt
      }
    }, { status: 200 });

  } catch (error) {
    log('PUT_REQUEST_ERROR', {
      error: error.message,
      errorCode: error.code,
      errorType: error.type,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, true);

    return NextResponse.json(
      { 
        success: false,
        error: "Failed to update appointment",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  log('DELETE_REQUEST_START', { 
    method: 'DELETE',
    hasCollectionId: !!COLLECTION_ID 
  });

  try {
    if (!COLLECTION_ID) {
      const errorMsg = 'Server configuration error: APPWRITE_COLLECTION_APPOINTMENTS not found';
      log('DELETE_MISSING_COLLECTION_ID', { error: errorMsg }, true);
      return NextResponse.json(
        { 
          success: false, 
          error: errorMsg 
        },
        { status: 500 }
      );
    }

    let requestBody;
    try {
      requestBody = await request.json();
      log('DELETE_REQUEST_BODY_PARSED', { body: requestBody });
    } catch (parseError) {
      log('DELETE_REQUEST_BODY_PARSE_ERROR', { error: parseError.message }, true);
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid JSON in request body" 
        },
        { status: 400 }
      );
    }

    const { id } = requestBody;
    
    log('DELETE_REQUEST_DATA_EXTRACTED', { id });

    if (!id) {
      log('DELETE_MISSING_ID', { requestBody }, true);
      return NextResponse.json(
        { 
          success: false,
          error: "Missing appointment ID" 
        },
        { status: 400 }
      );
    }

    log('DELETE_DELETING_DOCUMENT', { 
      collectionId: COLLECTION_ID,
      documentId: id 
    });

    await deleteDocument(COLLECTION_ID, id);

    log('DELETE_DOCUMENT_DELETED', { documentId: id });

    return NextResponse.json({
      success: true,
      message: "Appointment deleted successfully",
      data: { id }
    }, { status: 200 });

  } catch (error) {
    log('DELETE_REQUEST_ERROR', {
      error: error.message,
      errorCode: error.code,
      errorType: error.type,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, true);

    let userMessage = "Error deleting appointment";
    if (error.code === 404) {
      userMessage = "Appointment not found";
    }

    return NextResponse.json(
      { 
        success: false,
        error: userMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}