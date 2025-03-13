'use client';

import { useState } from 'react';
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, FileJson, Server } from 'lucide-react';

export default function ApiDocs() {
  const [apiFormat, setApiFormat] = useState<'openapi' | 'swagger'>('openapi');
  
  return (
    <div className="pb-12">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API Documentation</h1>
          <p className="mt-2 text-gray-600">
            Complete reference documentation for the MechDX API
          </p>
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="reference">API Reference</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="prose max-w-none">
              <h2>Getting Started with the MechDX API</h2>
              <p>
                Our API allows you to programmatically access and manage your HVAC equipment, 
                sensor data, and maintenance schedules. The API uses standard HTTP verbs and 
                returns JSON responses.
              </p>
              
              <div className="flex items-center gap-6 my-6">
                <div className="flex items-center gap-2 text-sm">
                  <Server className="h-5 w-5 text-[#0F62FE]" />
                  <span>Base URL: <code>https://api.mechdx.com/v1</code></span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Code className="h-5 w-5 text-[#0F62FE]" />
                  <span>Latest Version: <code>v1</code></span>
                </div>
              </div>
              
              <h3>Example Request</h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto">
                <code>
{`curl -X GET "https://api.mechdx.com/v1/equipment" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
                </code>
              </pre>
            </div>
          </TabsContent>
          
          <TabsContent value="authentication" className="space-y-6">
            <div className="prose max-w-none">
              <h2>Authentication</h2>
              <p>
                The MechDX API uses bearer token authentication. You can generate API keys from your account settings.
              </p>
              
              <h3>Obtaining an API Key</h3>
              <ol>
                <li>Log in to your MechDX account</li>
                <li>Navigate to Settings → API Keys</li>
                <li>Click "Generate New Key"</li>
                <li>Save your key somewhere safe - it will only be shown once</li>
              </ol>
              
              <h3>Using Your API Key</h3>
              <p>
                Include your API key in the Authorization header of each request:
              </p>
              
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto">
                <code>
{`Authorization: Bearer YOUR_API_KEY`}
                </code>
              </pre>
            </div>
          </TabsContent>
          
          <TabsContent value="reference">
            <div className="bg-white rounded-md">
              <div className="mb-4 flex justify-end gap-4 items-center">
                <div className="text-sm">API Format:</div>
                <div className="flex rounded-md overflow-hidden border border-gray-200">
                  <button 
                    className={`px-3 py-1 text-sm ${apiFormat === 'openapi' ? 'bg-[#0F62FE] text-white' : 'bg-gray-50 text-gray-700'}`}
                    onClick={() => setApiFormat('openapi')}
                  >
                    OpenAPI
                  </button>
                  <button 
                    className={`px-3 py-1 text-sm ${apiFormat === 'swagger' ? 'bg-[#0F62FE] text-white' : 'bg-gray-50 text-gray-700'}`}
                    onClick={() => setApiFormat('swagger')}
                  >
                    Swagger
                  </button>
                </div>
              </div>
              <div className="swagger-container">
                <SwaggerUI url={apiFormat === 'openapi' ? "/openapi.json" : "/swagger.yaml"} tryItOutEnabled={true} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}