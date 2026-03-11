import React from 'react'
import Post from '../components/Post'
import Nav from '../../shared/components/Nav'
import { usePost } from '../hook/usePost'
import "../style/feed.scss"

const Feed = () => {
    const { loading, error, feed, handleLike, handleUnLike } = usePost()

    if (loading) return (
        <div className="feed-page">
            <Nav />
            <div className="feed-container">
                <div className="feed">
                    <div className="posts">feed is loading...</div>
                </div>
            </div>
        </div>
    )
    if (error) return (
        <div className="feed-page">
            <Nav />
            <div className="feed-container">
                <div className="feed">
                    <div className="posts">Error: {error}</div>
                </div>
            </div>
        </div>
    )
    if (!feed) return (
        <div className="feed-page">
            <Nav />
            <div className="feed-container">
                <div className="feed">
                    <div className="posts">Please login</div>
                </div>
            </div>
        </div>
    )

    return (
        <div className="feed-page">
            <Nav />
            <div className="feed-container">
                <div className="feed">
                    <div className="posts">
                        {feed.map((post) => (
                            <Post
                                key={post._id}
                                user={post.user}
                                post={post}
                                loading={loading}
                                handleLike={handleLike}
                                handleUnLike={handleUnLike}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Feed