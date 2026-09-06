<!-- prettier-ignore-start -->
# Cat API

## Authorization

The API uses JWT bearer tokens. Log in through `POST /api/v1/auth/login` to
receive a token, then include it on protected requests:

```http
Authorization: Bearer <token>
```

Tokens are valid for 24 hours.

### Access rules

| Endpoint | Method | Access rule |
| --- | --- | --- |
| `/api/v1/auth/login` | `POST` | Public. |
| `/api/v1/auth/me` | `GET` | Authentication needed |
| `/api/v1/cats` | `GET` | Public |
| `/api/v1/cats/:id` | `GET` | Public |
| `/api/v1/cats/user/:userId` | `GET` | Public |
| `/api/v1/cats` | `POST` | Authentication needed. User becomes cat owner|
| `/api/v1/cats/:id` | `PUT` | Authentication needed. Only owner can update cat |
| `/api/v1/cats/:id` | `DELETE` | Authentication needed. Only owner can delete cat |
| `/api/v1/users` | `GET` | Public |
| `/api/v1/users/:id` | `GET` | Public |
| `/api/v1/users` | `POST` | Public |
| `/api/v1/users/:id` | `PUT` | Authentication needed |
| `/api/v1/users/:id` | `DELETE` | Authentication needed |

<!-- prettier-ignore-end -->

Security stuff

While testing the API, I noticed that if a user updated "role": "admin" they could change their own role. I fixed it by limiting the update endpoint to only accept "name, username and email". of course this created a new limitation so that no one is able to change passwords or roles through that endpoint.

Another weird thing I noticed was that if someone wanted to they could login, add a cat then by updating the cat and changing the owner in the form they could send their cat to another user. I fixed this by only taking cat_name, weight, and birthdate from req.body and then passing the data.
