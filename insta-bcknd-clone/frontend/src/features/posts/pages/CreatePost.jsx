import React, { useState, useRef } from 'react'
import "../style/createpost.scss"
import { usePost } from '../hook/usePost'
import { useNavigate } from 'react-router'

const CreatePost = () => {

    const [ caption, setCaption ] = useState("")
    const [imagePreview, setImagePreview] = useState("")
    const postImageInputFieldRef = useRef(null)

    const navigate = useNavigate()

    const { loading, handleCreatePost } = usePost()

    function handleImageChange(e) {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const file = postImageInputFieldRef.current.files[ 0 ]

        await handleCreatePost(file,caption)

        navigate('/')

    }

    if(loading){
        return (
            <main className='create-post-page'>
                <div className="create-post-container">
                    <div className="header">
                        <h2>Creating post...</h2>
                    </div>
                    <div className="form-container">
                        <div className="skeleton" style={{ height: '200px', borderRadius: '12px', marginBottom: '24px' }}></div>
                        <div className="skeleton" style={{ height: '100px', borderRadius: '12px' }}></div>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className='create-post-page' >
            <div className="create-post-container">
                <div className="header">
                    <h2>Create new post</h2>
                </div>
                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                    <div className="image-upload">
                        {imagePreview ? (
                            <div className="preview">
                                <img src={imagePreview} alt="Preview" />
                            </div>
                        ) : (
                            <label className='post-image-label' htmlFor="postImage">Select from computer</label>
                        )}
                        <input 
                            ref={postImageInputFieldRef} 
                            type="file" 
                            name='postImage' 
                            id='postImage' 
                            onChange={handleImageChange}
                            accept="image/*"
                        />
                    </div>
                    <textarea
                        value={caption}
                        onChange={(e) => { setCaption(e.target.value) }}
                        className="caption-input"
                        name='caption' 
                        placeholder='Write a caption...' 
                    />
                    <button 
                        type="submit"
                        className='submit-button' 
                        disabled={loading || !caption.trim()}
                    >
                        {loading ? 'Sharing...' : 'Share'}
                    </button>
                </form>
                </div>
            </div>
        </main>
    )
}

export default CreatePost