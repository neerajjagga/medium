# Blog Website
// Blog website backend planning

// how medium works
1. user can do nothing without signup/login
2. Every user can write and publish an article
3. Every user can follow to any other user
4. User can update their profile
5. User can create reading list and save the articles 

// user schema
1. name
2. username
2. email 
3. password
4. bio
5. imageId 
6. followers[] = default = 0 (objectId, ref : 'user')
7. following[] = default = 0 (objectId, ref : 'user')
8. followingTags[]


// blog schema
1. tile
2. subtitle
2. content
3. thumbnail
3. clapCount[(objectId, ref : 'user')] 
4. postResponses(comments) [{ObjectId, ref:'comments'}]
4. visibility : enum [locked, unlocked]
4. tags[]
5. readingTime : Number (in min)
5. creator (objectId, ref : 'user')
6. publishAt


# APIs
/user/signup
/user/login
/user/


// doubt on /api/addcomment/:blogId endpoint -> we will see later
