
import { rest } from 'msw';

// Define handlers for mocking API requests
export const handlers = [
  // Mock Supabase authentication endpoints
  rest.post('https://nvjjragekchczuxgdvvo.supabase.co/auth/v1/token', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        access_token: 'mock-access-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'mock-refresh-token',
        user: {
          id: 'mock-user-id',
          email: 'test@example.com',
        },
      })
    );
  }),
  
  // Mock profiles endpoint
  rest.get('https://nvjjragekchczuxgdvvo.supabase.co/rest/v1/profiles', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 'user1', username: 'TestUser1', avatar_url: null },
        { id: 'user2', username: 'TestUser2', avatar_url: 'avatar2.jpg' },
      ])
    );
  }),
  
  // Mock friends endpoint
  rest.get('https://nvjjragekchczuxgdvvo.supabase.co/rest/v1/friends', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { user_id: 'user1', friend_id: 'user2', created_at: new Date().toISOString() },
      ])
    );
  }),
  
  // Add more mock endpoints as needed
];
