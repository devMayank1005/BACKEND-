import { getFeed, createPost, likePost, unLikePost } from "../services/post.api"
import { useContext, useEffect, useState } from "react"
import { PostContext } from "../Post.context"
import { AuthContext } from "../../auth/auth.context"

export const usePost = () => {

    const context = useContext(PostContext)
    const authContext = useContext(AuthContext)
    const [error, setError] = useState(null)

    if (!context) {
        throw new Error("usePost must be used inside PostContextProvider")
    }

    if (!authContext) {
        throw new Error("usePost must be used inside AuthProvider")
    }

    const { loading, setLoading, post, setPost, feed, setFeed } = context
    const { user, loading: authLoading } = authContext

    const handleGetFeed = async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await getFeed()
            const posts = Array.isArray(data?.posts) ? data.posts : []
            setFeed([...posts].reverse())
        } catch (e) {
            const message = e?.response?.data?.message || e?.message || "Failed to load feed"
            setError(message)
            setFeed([])
        } finally {
            setLoading(false)
        }
    }

    const handleCreatePost = async (imageFile, caption) => {
        setLoading(true)
        setError(null)
        try {
            const data = await createPost(imageFile, caption)
            if(data?.post){
                await handleGetFeed()
            }
        } catch (e) {
            const message = e?.response?.data?.message || e?.message || "Failed to create post"
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    const handleLike = async (post) => {
        setError(null)
        const postId = post
        setFeed((prev) => (prev || []).map((p) => (p._id === postId ? { ...p, isLiked: true } : p)))
        try {
            await likePost(postId)
        } catch (e) {
            const message = e?.response?.data?.message || e?.message || "Failed to like post"
            setError(message)
            setFeed((prev) => (prev || []).map((p) => (p._id === postId ? { ...p, isLiked: false } : p)))
        }
    }

    const handleUnLike = async (post) => {
        setError(null)
        const postId = post
        setFeed((prev) => (prev || []).map((p) => (p._id === postId ? { ...p, isLiked: false } : p)))
        try {
            await unLikePost(postId)
        } catch (e) {
            const message = e?.response?.data?.message || e?.message || "Failed to unlike post"
            setError(message)
            setFeed((prev) => (prev || []).map((p) => (p._id === postId ? { ...p, isLiked: true } : p)))
        }
    }

    useEffect(() => {
        if (authLoading) return
        if (!user) {
            setError(null)
            setFeed([])
            return
        }
        handleGetFeed()
    }, [authLoading, user])

    return { loading, error, feed, post, handleGetFeed, handleCreatePost, handleLike, handleUnLike }

}