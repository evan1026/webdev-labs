-- Exercise 1 (done for you):
SELECT * FROM users;


-- Exercise 2 (done for you):
SELECT id, first_name, last_name 
    FROM users;


-- Exercise 3
SELECT id, first_name, last_name
    FROM users
    ORDER BY last_name;


-- Exercise 4
SELECT id, image_url, user_id
    FROM posts
    WHERE user_id = 26;


-- Exercise 5
SELECT id, image_url, user_id
    FROM posts
    WHERE user_id = 26
        OR user_id = 12;


-- Exercise 6
SELECT COUNT(*)
    FROM posts;


-- Exercise 7
SELECT user_id, count(*) AS count
    FROM comments
    GROUP BY user_id
    ORDER BY count DESC;


-- Exercise 8
SELECT p.id, p.image_url, p.user_id, u.username, u.first_name, u.last_name
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE u.id = 26
        OR u.id = 12;


-- Exercise 9
SELECT p.id, p.pub_date, f.following_id
    FROM posts p
    JOIN following f ON p.user_id = f.following_id
    WHERE f.user_id = 26;


-- Exercise 10
SELECT p.id, p.pub_date, f.following_id, u.username
    FROM posts p
    JOIN following f ON p.user_id = f.following_id
    JOIN users u ON f.following_id = u.id
    WHERE f.user_id = 26
    ORDER BY p.pub_date DESC;


-- Exercise 11
INSERT INTO bookmarks(user_id, post_id, timestamp) VALUES(26, 219, NOW());
INSERT INTO bookmarks(user_id, post_id, timestamp) VALUES(26, 220, NOW());
INSERT INTO bookmarks(user_id, post_id, timestamp) VALUES(26, 221, NOW());


-- Exercise 12
DELETE FROM bookmarks WHERE user_id = 26 AND post_id = 219;
DELETE FROM bookmarks WHERE user_id = 26 AND post_id = 220;
DELETE FROM bookmarks WHERE user_id = 26 AND post_id = 221;


-- Exercise 13
UPDATE users
    SET email='knick2022@gmail.com'
    WHERE id = 26;


-- Exercise 14
WITH comment_counts(post_id, count) AS (
    SELECT post_id, count(id)
        FROM comments
        GROUP BY post_id
)
SELECT p.id, p.user_id, c.count, p.caption
    FROM posts p
    JOIN comment_counts c ON p.id = c.post_id
    WHERE p.user_id = 26
    ORDER BY c.count DESC;
