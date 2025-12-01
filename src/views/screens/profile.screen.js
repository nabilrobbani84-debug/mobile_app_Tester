/**
 * Modiva - Profile Screen
 * Display and edit user profile
 * @module views/screens/profile
 */

import { Logger } from '../../utils/logger.js';
import { ProfileController } from '../../controllers/profile.controller.js';
import { AuthController } from '../../controllers/auth.controller.js';
import { store } from '../../state/store.js';

/**
 * Profile Screen Component
 */
export const ProfileScreen = {
    /**
     * Screen ID
     */
    id: 'profileScreen',

    /**
     * Initialize profile screen
     */
    async init() {
        Logger.info('👤 ProfileScreen: Initializing');
        
        this.render();
        await this.loadData();
        this.attachEventListeners();
    },

    /**
     * Render screen
     */
    render() {
        const container = document.getElementById(this.id);
        
        if (!container) {
            Logger.error('Profile screen container not found');
            return;
        }

        container.classList.add('active');
        
        // Update profile data
        this.updateProfileData();
    },

    /**
     * Load profile data
     */
    async loadData() {
        try {
            await ProfileController.loadProfile();
            
            // Update UI
            this.updateProfileData();
            
        } catch (error) {
            Logger.error('❌ Failed to load profile:', error);
        }
    },

    /**
     * Update profile data
     */
    updateProfileData() {
        const statistics = ProfileController.getUserStatistics();

        // Update profile name
        const profileName = document.getElementById('profileName');
        if (profileName) {
            profileName.textContent = statistics.name || 'Pengguna';
        }

        // Update school
        const profileSchool = document.getElementById('profileSchool');
        if (profileSchool) {
            profileSchool.textContent = statistics.school || '-';
        }

        // Update NISN
        const profileNISN = document.getElementById('profileNISN');
        if (profileNISN) {
            profileNISN.textContent = statistics.nisn || '-';
        }

        // Update email
        const profileEmail = document.getElementById('profileEmail');
        if (profileEmail) {
            profileEmail.textContent = statistics.email || '-';
        }

        // Update height
        const profileHeight = document.getElementById('profileHeight');
        if (profileHeight) {
            profileHeight.textContent = statistics.height ? `${statistics.height} cm` : '-';
        }

        // Update weight
        const profileWeight = document.getElementById('profileWeight');
        if (profileWeight) {
            profileWeight.textContent = statistics.weight ? `${statistics.weight} kg` : '-';
        }

        // Update HB
        const profileHB = document.getElementById('profileHB');
        if (profileHB) {
            profileHB.textContent = statistics.currentHB ? `${statistics.currentHB} g/dL` : '-';
        }

        // Update consumption count
        const profileConsumption = document.getElementById('profileConsumption');
        if (profileConsumption) {
            profileConsumption.textContent = statistics.consumptionCount || 0;
        }

        // Update target
        const profileTarget = document.getElementById('profileTarget');
        if (profileTarget) {
            profileTarget.textContent = statistics.consumptionTarget || 48;
        }

        // Update avatar initial
        const avatarElements = document.querySelectorAll('#profileScreen .w-24.h-24, #profileScreen .w-12.h-12');
        avatarElements.forEach(el => {
            if (statistics.name) {
                el.textContent = statistics.name.charAt(0).toUpperCase();
            }
        });
    },

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Edit profile button
        const editButton = document.querySelector('#profileScreen button[onclick*="Edit"]');
        if (editButton) {
            editButton.onclick = () => {
                this.handleEditProfile();
            };
        }

        // Logout button
        const logoutButton = document.querySelector('#profileScreen button[onclick*="logout"]');
        if (logoutButton) {
            logoutButton.onclick = () => {
                this.handleLogout();
            };
        }
    },

    /**
     * Handle edit profile
     */
    handleEditProfile() {
        alert('Fitur Edit Profil akan segera hadir!');
        
        // TODO: Navigate to edit profile screen
        Logger.info('✏️ Edit profile clicked');
    },

    /**
     * Handle logout
     */
    async handleLogout() {
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            Logger.info('🚪 ProfileScreen: Logging out');
            
            try {
                await AuthController.logout();
                
                // Navigation handled by auth controller
                
            } catch (error) {
                Logger.error('❌ Logout failed:', error);
            }
        }
    },

    /**
     * Refresh data
     */
    async refresh() {
        Logger.info('🔄 ProfileScreen: Refreshing data');
        await this.loadData();
    },

    /**
     * Cleanup
     */
    cleanup() {
        Logger.info('🧹 ProfileScreen: Cleanup');
    }
};

export default ProfileScreen;