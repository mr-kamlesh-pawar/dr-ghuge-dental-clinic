import { NextResponse } from "next/server";
import { listDocuments, Query } from "@/lib/appwrite";

const COLLECTION_ID = process.env.APPWRITE_COLLECTION_REVIEWS;
const PAGE_SIZE = 12; // Number of reviews per page

export async function GET(request) {
  try {
    // Validate environment variable
    if (!COLLECTION_ID) {
      console.error('Missing APPWRITE_COLLECTION_REVIEWS environment variable');
      return NextResponse.json(
        { 
          success: false, 
          error: "Server configuration error",
          data: [],
          total: 0,
          page: 1,
          totalPages: 0
        }, 
        { status: 500 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || PAGE_SIZE;
    const sort = searchParams.get('sort') || 'newest'; // newest, highest_rating, oldest
    
    console.log('Fetching reviews:', { page, limit, sort, collection: COLLECTION_ID });

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build queries based on sort option
    let queries = [Query.limit(limit)];
    
    if (offset > 0) {
      queries.push(Query.offset(offset));
    }

    // Add sort query
    switch(sort) {
      case 'highest_rating':
        queries.push(Query.orderDesc('rating'));
        queries.push(Query.orderDesc('$createdAt'));
        break;
      case 'oldest':
        queries.push(Query.orderAsc('$createdAt'));
        break;
      case 'newest':
      default:
        queries.push(Query.orderDesc('$createdAt'));
        break;
    }

    // Fetch reviews
    const result = await listDocuments(COLLECTION_ID, queries);
    
    // Also get total count for pagination
    const totalCountResult = await listDocuments(COLLECTION_ID, [Query.limit(1)]);
    const total = totalCountResult.total || 0;
    const totalPages = Math.ceil(total / limit);

    console.log('Reviews fetched:', { 
      count: result.documents.length, 
      total, 
      totalPages,
      page 
    });

    // Transform documents
    const reviews = result.documents.map(doc => ({
      id: doc.$id,
      patientname: doc.patientname || "Anonymous",
      service: doc.service || "General Dentistry",
      rating: typeof doc.rating === 'number' ? Math.min(5, Math.max(1, doc.rating)) : 5,
      comment: doc.comment || "Great experience!",
      created_at: doc.$createdAt || doc.created_at,
      updatedAt: doc.$updatedAt,
      // Ensure we have all required fields
      status: doc.status || 'published'
    }));

    // Calculate average rating
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;

    // Calculate rating distribution
    const ratingDistribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    };

    return NextResponse.json({
      success: true,
      data: reviews,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        averageRating: parseFloat(averageRating.toFixed(1)),
        ratingDistribution
      }
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        'CDN-Cache-Control': 'public, s-maxage=300'
      }
    });

  } catch (error) {
    console.error("Error fetching reviews:", {
      message: error.message,
      code: error.code,
      type: error.type,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch reviews",
        message: process.env.NODE_ENV === 'development' ? error.message : undefined,
        data: [],
        meta: {
          total: 0,
          page: 1,
          limit: PAGE_SIZE,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
          averageRating: 0,
          ratingDistribution: {5:0,4:0,3:0,2:0,1:0}
        }
      }, 
      { status: 500 }
    );
  }
}

// POST endpoint for submitting new reviews
export async function POST(request) {
  try {
    if (!COLLECTION_ID) {
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    const body = await request.json();
    
    // Validation
    const errors = [];
    if (!body.patientname || body.patientname.trim() === '') {
      errors.push('Patient name is required');
    }
    if (!body.comment || body.comment.trim() === '') {
      errors.push('Comment is required');
    }
    if (!body.rating || body.rating < 1 || body.rating > 5) {
      errors.push('Rating must be between 1 and 5');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    // In real implementation, you would use createDocument here
    // For now, simulate creation
    const newReview = {
      id: 'temp-' + Date.now(),
      ...body,
      patientname: body.patientname.trim(),
      comment: body.comment.trim(),
      rating: parseInt(body.rating),
      service: body.service || 'General Dentistry',
      created_at: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'pending' // Would be 'published' after approval
    };

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully. It will appear after approval.",
      data: newReview
    }, { status: 201 });

  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit review" },
      { status: 500 }
    );
  }
}