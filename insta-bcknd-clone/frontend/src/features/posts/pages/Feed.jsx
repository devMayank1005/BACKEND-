import React from 'react'
import "../style/feed.scss"
import Post from '../components/Post'
import { usePost } from '../hook/usePost'
import Nav from '../../shared/components/Nav'

const Feed = () => {

    const { feed, loading, handleLike, handleUnLike } = usePost()

    if (loading) {
        return (
            <main>
                <h1>Feed is loading...</h1>
            </main>
        )
    }

    return (
        <main className='feed-page'>
            <Nav />
            <div className="feed">
                <div className="posts">
                    {feed.map(post => (
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
        </main>
    )
}

export default Feed