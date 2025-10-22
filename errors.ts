export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error)
  
  if (error instanceof AppError) {
    return new Response(
      JSON.stringify({ 
        error: error.message,
        code: error.code 
      }),
      { status: error.statusCode }
    )
  }
  
  if (error instanceof z.ZodError) {
    return new Response(
      JSON.stringify({ 
        error: 'Validation error',
        details: error.errors 
      }),
      { status: 400 }
    )
  }
  
  return new Response(
    JSON.stringify({ 
      error: 'Internal server error' 
    }),
    { status: 500 }
  )
}
