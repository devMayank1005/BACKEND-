import React, { useEffect, useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { getUserProfile } from '../services/user.api'
import "./UserProfileSidebar.scss"

const UserProfileSidebar = () => {
    const { user } = useAuth()
    const [userStats, setUserStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user) {
                setLoading(false)
                return
            }

            try {
                const data = await getUserProfile()
                setUserStats(data.user)
            } catch (error) {
                console.error('Failed to fetch user profile:', error)
                setError(error.message || 'Failed to load profile')
            } finally {
                setLoading(false)
            }
        }

        fetchUserProfile()
    }, [user])

    if (!user) {
        return null
    }

    // For now, just show basic user info without API call
    const stats = userStats || user

    return (
        <div className="user-profile-sidebar">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar">
                        <img 
                            src={stats.profileImage || stats.profilePicture || `https://ui-avatars.com/api/?name=${stats.username}&background=833ab4&color=fff&size=128`} 
                            alt={stats.username}
                        />
                    </div>
                    <div className="profile-info">
                        <h3 className="username">{stats.username}</h3>
                        <p className="fullname">{stats.fullname || stats.username}</p>
                    </div>
                </div>
                
                <div className="profile-stats">
                    <div className="stat-item">
                        <span className="stat-number">{stats.postsCount || 0}</span>
                        <span className="stat-label">posts</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{stats.followersCount || 0}</span>
                        <span className="stat-label">followers</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{stats.followingCount || 0}</span>
                        <span className="stat-label">following</span>
                    </div>
                </div>

                <div className="profile-bio">
                    <p>{stats.bio || "No bio yet"}</p>
                </div>

                <button className="switch-profile-btn">
                    Switch accounts
                </button>
            </div>

            <div className="footer-links">
                <a href="#" className="footer-link">About</a>
                <span className="dot">·</span>
                <a href="#" className="footer-link">Help</a>
                <span className="dot">·</span>
                <a href="#" className="footer-link">Press</a>
                <span className="dot">·</span>
                <a href="#" className="footer-link">Jobs</a>
                <span className="dot">·</span>
                <a href="#" className="footer-link">Privacy</a>
                <span className="dot">·</span>
                <a href="#" className="footer-link">Terms</a>
                <span className="dot">·</span>
                <a href="#" className="footer-link">Locations</a>
                <span className="dot">·</span>
                <a href="#" className="footer-link">Language</a>
            </div>
            
            <div className="copyright">
                © 2024 INSTAGRAM CLONE
            </div>
        </div>
    )
}

export default UserProfileSidebar
