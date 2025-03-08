
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
      const policies = [
        {
          name: 'Avatar Read Access Policy',
          definition: {
            bucket_id: 'avatars',
            name: 'Avatar Read Access',
            operation: 'READ',
            statement: {
              effect: 'ALLOW',
              principal: '*',
              conditions: {}
            }
          }
        },
        {
          name: 'Avatar Insert Access Policy',
          definition: {
            bucket_id: 'avatars',
            name: 'Avatar Insert Access',
            operation: 'INSERT',
            statement: {
              effect: 'ALLOW',
              principal: {
                type: 'JWT',
                value: 'authenticated'
              },
              conditions: {}
            }
          }
        },
        {
          name: 'Avatar Update Access Policy',
          definition: {
            bucket_id: 'avatars',
            name: 'Avatar Update Access',
            operation: 'UPDATE',
            statement: {
              effect: 'ALLOW',
              principal: {
                type: 'JWT',
                value: 'authenticated'
              },
              conditions: {}
            }
          }
        },
        {
          name: 'Avatar Delete Access Policy',
          definition: {
            bucket_id: 'avatars',
            name: 'Avatar Delete Access',
            operation: 'DELETE',
            statement: {
              effect: 'ALLOW',
              principal: {
                type: 'JWT',
                value: 'authenticated'
              },
              conditions: {}
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
      // If the bucket exists, ensure it has the necessary policies
      const policies = [
        {
          name: 'Avatar Read Access Policy',
          definition: {
            bucket_id: 'avatars',
            name: 'Avatar Read Access',
            operation: 'READ',
            statement: {
              effect: 'ALLOW',
              principal: '*',
              conditions: {}
            }
          }
        },
        {
          name: 'Avatar Insert Access Policy',
          definition: {
            bucket_id: 'avatars',
            name: 'Avatar Insert Access',
            operation: 'INSERT',
            statement: {
              effect: 'ALLOW',
              principal: {
                type: 'JWT',
                value: 'authenticated'
              },
              conditions: {}
            }
          }
        },
        {
          name: 'Avatar Update Access Policy',
          definition: {
            bucket_id: 'avatars',
            name: 'Avatar Update Access',
            operation: 'UPDATE',
            statement: {
              effect: 'ALLOW',
              principal: {
                type: 'JWT',
                value: 'authenticated'
              },
              conditions: {}
            }
          }
        },
        {
          name: 'Avatar Delete Access Policy',
          definition: {
            bucket_id: 'avatars',
            name: 'Avatar Delete Access',
            operation: 'DELETE',
            statement: {
              effect: 'ALLOW',
              principal: {
                type: 'JWT',
                value: 'authenticated'
              },
              conditions: {}
            }
          }
        }
      ];

      // Apply each policy
      for (const policy of policies) {
        try {
          await supabaseAdmin
            .storage
            .createPolicy(policy.definition)
        } catch (error) {
          console.log(`Policy ${policy.name} might already exist:`, error);
          // Continue with other policies even if one fails
        }
      }

      return new Response(
        JSON.stringify({ message: 'Avatars bucket already exists, policies checked' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }
  } catch (error) {
    console.error('Error creating avatars bucket:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
