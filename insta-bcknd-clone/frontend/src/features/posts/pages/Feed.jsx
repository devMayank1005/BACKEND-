import React from 'react'
import Post from '../components/Post'
import Nav from '../../shared/components/Nav'
import { usePost } from '../hook/usePost'
import "../style/feed.scss"

const Feed = () => {
    const { loading, error, feed, handleLike, handleUnLike } = usePost()

    if (loading) {
        return (
            <div className="feed-page">
                <Nav />
                <div className="feed">
                    <div className="posts">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="post">
                                <div className="skeleton" style={{ height: '60px', borderRadius: '8px 8px 0 0' }}></div>
                                <div className="skeleton" style={{ height: '400px' }}></div>
                                <div className="skeleton" style={{ height: '80px', borderRadius: '0 0 8px 8px' }}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="feed-page">
                <Nav />
                <div className="feed">
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8e8e8e' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📸</div>
                        <h3 style={{ color: '#262626', marginBottom: '8px' }}>Something went wrong</h3>
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        )
    }

    if (!feed || feed.length === 0) {
        return (
            <div className="feed-page">
                <Nav />
                <div className="feed">
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8e8e8e' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏞️</div>
                        <h3 style={{ color: '#262626', marginBottom: '8px' }}>No posts yet</h3>
                        <p>Start following people to see their posts here</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="feed-page">
            <Nav />
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
    )
}

export default Feed