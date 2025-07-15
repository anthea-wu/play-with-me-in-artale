# API Documentation

## Base URL
- Development: `http://localhost:3000`
- Production: `https://play-with-me-in-artale.vercel.app`

## Endpoints

### GET /api/groups
Get all groups ordered by creation date (newest first).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cmd45btmy00008s3gykiixxne",
      "job": "龍騎士",
      "level": 85,
      "map": "DT",
      "startTime": "2025-07-15T20:00:00.000Z",
      "endTime": "2025-07-15T22:00:00.000Z",
      "gameId": "DragonKnight123",
      "discordId": "dragon#1234",
      "createdAt": "2025-07-15T06:23:14.890Z",
      "userId": null
    }
  ],
  "message": "Groups retrieved successfully"
}
```

### POST /api/groups
Create a new group.

**Request Body:**
```json
{
  "job": "龍騎士",
  "level": 85,
  "map": "DT",
  "startTime": "2025-07-15T20:00:00Z",
  "endTime": "2025-07-15T22:00:00Z",
  "gameId": "TestPlayer123",
  "discordId": "test#1234"
}
```

**Validation Rules:**
- `job`: Must be either "龍騎士" or "祭司"
- `level`: Must be integer >= 70
- `map`: Must be "DT", "PW", or "CD"
- `startTime`: Must be valid ISO 8601 datetime
- `endTime`: Must be valid ISO 8601 datetime and after startTime
- `gameId`: Required, 1-50 characters
- `discordId`: Optional, max 50 characters

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "cmd45btmy00008s3gykiixxne",
    "job": "龍騎士",
    "level": 85,
    "map": "DT",
    "startTime": "2025-07-15T20:00:00.000Z",
    "endTime": "2025-07-15T22:00:00.000Z",
    "gameId": "TestPlayer123",
    "discordId": "test#1234",
    "createdAt": "2025-07-15T06:23:14.890Z",
    "userId": null
  },
  "message": "Group created successfully"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "level",
      "message": "Level must be at least 70"
    }
  ]
}
```

## Error Handling

All endpoints return consistent error responses:

- **400 Bad Request**: Validation errors
- **500 Internal Server Error**: Server errors

Error response format:
```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

## Testing

Use the provided `test-api.http` file for manual testing with REST Client extensions.