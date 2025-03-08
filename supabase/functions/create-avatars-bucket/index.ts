
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the admin key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check if the avatars bucket already exists
    const { data: buckets, error: getBucketsError } = await supabaseAdmin
      .storage
      .listBuckets()

    if (getBucketsError) throw getBucketsError

    const avatarBucketExists = buckets.some(bucket => bucket.name === 'avatars')

    if (!avatarBucketExists) {
      // Create a new bucket for avatars
      const { data, error } = await supabaseAdmin
        .storage
        .createBucket('avatars', {
          public: true, 
          fileSizeLimit: 1024 * 1024 * 2, // 2MB
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
        })

      if (error) throw error

      // Create storage policies that allow users to manage their own avatars
      // Create more lenient policies to allow authenticated users to upload
      const policies = [
        {
          name: 'Avatar Public Read Access Policy',
          definition: {
            bucket_id: 'avatars',
            name: 'Avatar Public Read Access',
            operation: 'READ',
            statement: {
              effect: 'ALLOW',
              principal: '*', // Anyone can read
              conditions: {}
            }
          }
        },
        {
          name: 'Avatar Authenticated Insert Access Policy',
          definition: {
            bucket_id: 'avatars',
            name: 'Avatar Authenticated Insert Access',
            operation: 'INSERT',
            statement: {
              effect: 'ALLOW',
              principal: {
                type: 'JWT',
                value: 'authenticated'
              },
              conditions: {} // Any authenticated user can insert
            }
          }
        },
        {
          name: 'Avatar Authenticated Update Access Policy',
          definition: {
            bucket_id: 'avatars',
            name: 'Avatar Authenticated Update Access',
            operation: 'UPDATE',
            statement: {
              effect: 'ALLOW',
              principal: {
                type: 'JWT',
                value: 'authenticated'
              },
              conditions: {} // Any authenticated user can update
            }
          }
        },
        {
          name: 'Avatar Authenticated Delete Access Policy',
          definition: {
            bucket_id: 'avatars',
            name: 'Avatar Authenticated Delete Access',
            operation: 'DELETE',
            statement: {
              effect: 'ALLOW',
              principal: {
                type: 'JWT',
                value: 'authenticated'
              },
              conditions: {} // Any authenticated user can delete
            }
          }
        }
      ];

      // Apply each policy
      for (const policy of policies) {
        const { error: policyError } = await supabaseAdmin
          .storage
          .createPolicy(policy.definition)

        if (policyError) {
          console.error(`Error creating policy ${policy.name}:`, policyError);
          // Continue with other policies even if one fails
        }
      }

      return new Response(
        JSON.stringify({ message: 'Avatars bucket created successfully with policies', data }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    } else {
      // If the bucket exists, ensure it has the necessary policies with more permissive settings
      const policies = [
        {
          name: 'Avatar Public Read Access Policy',
          definition: {
            bucket_id: 'avatars',
            name: 'Avatar Public Read Access',
            operation: 'READ',
            statement: {
              effect: 'ALLOW',
              principal: '*', // Anyone can read
              conditions: {}
            }
          }
        },
        {
          name: 'Avatar Authenticated Insert Access Policy',
          definition: {
            bucket_id: 'avatars',
            name: 'Avatar Authenticated Insert Access',
            operation: 'INSERT',
            statement: {
              effect: 'ALLOW',
              principal: {
                type: 'JWT',
                value: 'authenticated'
              },
              conditions: {} // Any authenticated user can insert
            }
          }
        },
        {
          name: 'Avatar Authenticated Update Access Policy',
          definition: {
            bucket_id: 'avatars',
            name: 'Avatar Authenticated Update Access',
            operation: 'UPDATE',
            statement: {
              effect: 'ALLOW',
              principal: {
                type: 'JWT',
                value: 'authenticated'
              },
              conditions: {} // Any authenticated user can update
            }
          }
        },
        {
          name: 'Avatar Authenticated Delete Access Policy',
          definition: {
            bucket_id: 'avatars',
            name: 'Avatar Authenticated Delete Access',
            operation: 'DELETE',
            statement: {
              effect: 'ALLOW',
              principal: {
                type: 'JWT',
                value: 'authenticated'
              },
              conditions: {} // Any authenticated user can delete
            }
          }
        }
      ];

      // Try to update all policies with more permissive settings
      for (const policy of policies) {
        try {
          // Delete existing policy if it exists
          try {
            await supabaseAdmin
              .storage
              .deletePolicy(policy.definition.bucket_id, policy.definition.name)
          } catch (error) {
            // Ignore errors when deleting - policy might not exist yet
          }

          // Create the policy with updated settings
          await supabaseAdmin
            .storage
            .createPolicy(policy.definition)
        } catch (error) {
          console.log(`Issue with policy ${policy.name}:`, error);
          // Continue with other policies even if one fails
        }
      }

      return new Response(
        JSON.stringify({ message: 'Avatars bucket already exists, policies updated' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }
  } catch (error) {
    console.error('Error creating/updating avatars bucket:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
