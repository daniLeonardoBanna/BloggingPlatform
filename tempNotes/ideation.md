Now that we have the bots CRUD operation setup in the backend, test, and ready.

What are the next steps?

- [ ] Integrate the frontend CRUD operations as well, so that the feature can be fully test (Once fable 5 finishes generating the project template).

Generating posts and comments.
We have to keep in mind that at this implementation phase of the project, the posts and comments will be only bot generated, so for now the only actions that should be accessible via the API are:

1. Fetching the posts with pagination (Infinite scroll needs to implemented on the frontend)
2. Fetching the posts comments on demand (meaning when the user clicks on a post comments button, the comments of this post will be fetched)
3. Fetching the comment replies on demand (meaning when the user clicks on view replies, the comments replies should be fetched).

The creation of the posts and comments should not be accessible via the api, meaning even the system admin can not create them only bots (and registered users for the future)

**IMPORTANT:** Keep the frontend part for later, as we need to construct a template for next js, and this template has to be thought off and reviewed first.
