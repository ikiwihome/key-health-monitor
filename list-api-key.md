# List API keys

GET https://openrouter.ai/api/v1/keys

List all API keys for the authenticated user. [Provisioning key](/docs/guides/overview/auth/provisioning-api-keys) required.

Reference: https://openrouter.ai/docs/api/api-reference/api-keys/list

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: List API keys
  version: endpoint_apiKeys.list
paths:
  /keys:
    get:
      operationId: list
      summary: List API keys
      description: >-
        List all API keys for the authenticated user. [Provisioning
        key](/docs/guides/overview/auth/provisioning-api-keys) required.
      tags:
        - - subpackage_apiKeys
      parameters:
        - name: include_disabled
          in: query
          description: Whether to include disabled API keys in the response
          required: false
          schema:
            type: string
        - name: offset
          in: query
          description: Number of API keys to skip for pagination
          required: false
          schema:
            type: string
        - name: Authorization
          in: header
          description: API key as bearer token in Authorization header
          required: true
          schema:
            type: string
      responses:
        '200':
          description: List of API keys
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/API Keys_list_Response_200'
        '401':
          description: Unauthorized - Missing or invalid authentication
          content: {}
        '429':
          description: Too Many Requests - Rate limit exceeded
          content: {}
        '500':
          description: Internal Server Error
          content: {}
components:
  schemas:
    KeysGetResponsesContentApplicationJsonSchemaDataItems:
      type: object
      properties:
        hash:
          type: string
          description: Unique hash identifier for the API key
        name:
          type: string
          description: Name of the API key
        label:
          type: string
          description: Human-readable label for the API key
        disabled:
          type: boolean
          description: Whether the API key is disabled
        limit:
          type:
            - number
            - 'null'
          format: double
          description: Spending limit for the API key in USD
        limit_remaining:
          type:
            - number
            - 'null'
          format: double
          description: Remaining spending limit in USD
        limit_reset:
          type:
            - string
            - 'null'
          description: Type of limit reset for the API key
        include_byok_in_limit:
          type: boolean
          description: Whether to include external BYOK usage in the credit limit
        usage:
          type: number
          format: double
          description: Total OpenRouter credit usage (in USD) for the API key
        usage_daily:
          type: number
          format: double
          description: OpenRouter credit usage (in USD) for the current UTC day
        usage_weekly:
          type: number
          format: double
          description: >-
            OpenRouter credit usage (in USD) for the current UTC week
            (Monday-Sunday)
        usage_monthly:
          type: number
          format: double
          description: OpenRouter credit usage (in USD) for the current UTC month
        byok_usage:
          type: number
          format: double
          description: Total external BYOK usage (in USD) for the API key
        byok_usage_daily:
          type: number
          format: double
          description: External BYOK usage (in USD) for the current UTC day
        byok_usage_weekly:
          type: number
          format: double
          description: >-
            External BYOK usage (in USD) for the current UTC week
            (Monday-Sunday)
        byok_usage_monthly:
          type: number
          format: double
          description: External BYOK usage (in USD) for current UTC month
        created_at:
          type: string
          description: ISO 8601 timestamp of when the API key was created
        updated_at:
          type:
            - string
            - 'null'
          description: ISO 8601 timestamp of when the API key was last updated
        expires_at:
          type:
            - string
            - 'null'
          format: date-time
          description: >-
            ISO 8601 UTC timestamp when the API key expires, or null if no
            expiration
      required:
        - hash
        - name
        - label
        - disabled
        - limit
        - limit_remaining
        - limit_reset
        - include_byok_in_limit
        - usage
        - usage_daily
        - usage_weekly
        - usage_monthly
        - byok_usage
        - byok_usage_daily
        - byok_usage_weekly
        - byok_usage_monthly
        - created_at
        - updated_at
    API Keys_list_Response_200:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: >-
              #/components/schemas/KeysGetResponsesContentApplicationJsonSchemaDataItems
          description: List of API keys
      required:
        - data

```

## SDK Code Examples

```python
import requests

url = "https://openrouter.ai/api/v1/keys"

headers = {"Authorization": "Bearer <token>"}

response = requests.get(url, headers=headers)

print(response.json())
```

```javascript
const url = 'https://openrouter.ai/api/v1/keys';
const options = {method: 'GET', headers: {Authorization: 'Bearer <token>'}};

try {
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.error(error);
}
```

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://openrouter.ai/api/v1/keys"

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("Authorization", "Bearer <token>")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

```ruby
require 'uri'
require 'net/http'

url = URI("https://openrouter.ai/api/v1/keys")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["Authorization"] = 'Bearer <token>'

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://openrouter.ai/api/v1/keys")
  .header("Authorization", "Bearer <token>")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://openrouter.ai/api/v1/keys', [
  'headers' => [
    'Authorization' => 'Bearer <token>',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://openrouter.ai/api/v1/keys");
var request = new RestRequest(Method.GET);
request.AddHeader("Authorization", "Bearer <token>");
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Authorization": "Bearer <token>"]

let request = NSMutableURLRequest(url: NSURL(string: "https://openrouter.ai/api/v1/keys")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "GET"
request.allHTTPHeaderFields = headers

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error as Any)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
```