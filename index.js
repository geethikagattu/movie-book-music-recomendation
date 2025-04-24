
      // User authentication state
      let currentUser = null;
      let userActivities = [];

      // Check if user is logged in from localStorage on page load
      window.onload = function() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          currentUser = JSON.parse(savedUser);
          updateUIForLoggedInUser();
          loadUserActivities();
        }
      };

      // Function to show content section
      function showContent(sectionId) {
        // Hide selection screen
        document.getElementById("selection-screen").style.display = "none";
        
        // Hide user activity if it was showing
        document.getElementById("user-activity").classList.remove("active");

        // Hide all content sections
        const contentSections = document.querySelectorAll(".content-section");
        contentSections.forEach((section) => {
          section.classList.remove("active");
        });

        // Show selected content section
        document.getElementById(sectionId).classList.add("active");

        // Load content based on selection
        if (sectionId === "movie-recommendations") {
          loadMovieRecommendations();
        } else if (sectionId === "music-recommendations") {
          loadMusicRecommendations();
        }
      }

      // Handle box click with user tracking
      function handleBoxClick(sectionId) {
        if (currentUser) {
          // Track user activity
          const activityData = {
            id: Date.now(),
            type: sectionId,
            title: getActivityTitle(sectionId),
            timestamp: new Date().toISOString()
          };
          addUserActivity(activityData);
        }
        
        // Show the content section
        showContent(sectionId);
      }

      function getActivityTitle(sectionId) {
        switch(sectionId) {
          case 'movie-recommendations':
            return 'Viewed Movie Recommendations';
          case 'music-recommendations':
            return 'Viewed Music Recommendations';
          case 'book-recommendations':
            return 'Viewed Book Recommendations';
          default:
            return 'Viewed Content';
        }
      }

      // Function to go back to selection screen
      function showSelectionScreen() {
        // Hide all content sections
        const contentSections = document.querySelectorAll(".content-section");
        contentSections.forEach((section) => {
          section.classList.remove("active");
        });

        // Show selection screen
        document.getElementById("selection-screen").style.display = "block";
      }

      // Function to load movie recommendations
      function loadMovieRecommendations() {
        // This function will integrate your existing movie recommendations code
        // For now, let's just show a placeholder message
        const movieContent = document.getElementById(
          "movie-recommendations-content"
        );
        movieContent.innerHTML = `
          <div style="text-align: center; padding: 20px;">
            <p>Your existing movie recommendations code would be integrated here.</p>
            <p>Place your movie recommendation component in this container.</p>
          </div>
        `;

        // Insert your actual movie recommendations code here
        // movieContent.innerHTML = yourMovieRecommendationCode;
      }

      // Function to load music recommendations
      function loadMusicRecommendations() {
        // This function will integrate your existing music recommendations code
        // For now, let's just show a placeholder message
        const musicContent = document.getElementById(
          "music-recommendations-content"
        );
        musicContent.innerHTML = `
          <div style="text-align: center; padding: 20px;">
            <p>Your existing music recommendations code would be integrated here.</p>
            <p>Place your music recommendation component in this container.</p>
          </div>
        `;

        // Insert your actual music recommendations code here
        // musicContent.innerHTML = yourMusicRecommendationCode;
      }
      
      // Authentication Modal Functions
      function showAuthModal() {
        document.getElementById('auth-modal').style.display = 'block';
      }
      
      function closeAuthModal() {
        document.getElementById('auth-modal').style.display = 'none';
      }
      
      function toggleAuthForms() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        if (loginForm.style.display === 'none') {
          loginForm.style.display = 'block';
          registerForm.style.display = 'none';
        } else {
          loginForm.style.display = 'none';
          registerForm.style.display = 'block';
        }
      }
      
      // User Authentication Functions
      function loginUser() {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        if (!username || !password) {
          alert('Please enter both username and password');
          return;
        }
        
        // In a real app, you would validate against a backend database
        // For this demo, we'll just check localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
          currentUser = {
            id: user.id,
            username: user.username,
            email: user.email
          };
          
          // Store current user in localStorage (excluding password)
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          
          // Update UI
          updateUIForLoggedInUser();
          
          // Close modal
          closeAuthModal();
          
          // Load user activities
          loadUserActivities();
        } else {
          alert('Invalid username or password');
        }
      }
      
      function registerUser() {
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        
        if (!username || !email || !password) {
          alert('Please fill in all fields');
          return;
        }
        
        // Get existing users from localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if username already exists
        if (users.some(u => u.username === username)) {
          alert('Username already taken');
          return;
        }
        
        // Create new user
        const newUser = {
          id: Date.now(),
          username,
          email,
          password
        };
        
        // Add to users array
        users.push(newUser);
        
        // Save back to localStorage
        localStorage.setItem('users', JSON.stringify(users));
        
        // Auto login
        currentUser = {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update UI
        updateUIForLoggedInUser();
        
        // Close modal
        closeAuthModal();
        
        // Initialize empty activities array for new user
        localStorage.setItem(`activities_${currentUser.id}`, JSON.stringify([]));
      }
      
      function logoutUser() {
        currentUser = null;
        localStorage.removeItem('currentUser');
        updateUIForLoggedOutUser();
      }
      
      // Update UI based on authentication state
      function updateUIForLoggedInUser() {
        document.getElementById('auth-button').style.display = 'none';
        document.getElementById('user-profile').style.display = 'block';
        document.getElementById('username-display').textContent = currentUser.username;
        document.getElementById('profile-tab').style.display = 'flex';
      }
      
      function updateUIForLoggedOutUser() {
        document.getElementById('auth-button').style.display = 'block';
        document.getElementById('user-profile').style.display = 'none';
        document.getElementById('profile-tab').style.display = 'none';
        
        // If on activity page, return to main page
        if (document.getElementById('user-activity').classList.contains('active')) {
          showSelectionScreen();
        }
      }
      
      // User Activity Functions
      function addUserActivity(activity) {
        if (!currentUser) return;
        
        // Get existing activities
        userActivities = JSON.parse(localStorage.getItem(`activities_${currentUser.id}`) || '[]');
        
        // Add new activity
        userActivities.unshift(activity); // Add to beginning of array
        
        // Only keep last 50 activities
        if (userActivities.length > 50) {
          userActivities = userActivities.slice(0, 50);
        }
        
        // Save back to localStorage
        localStorage.setItem(`activities_${currentUser.id}`, JSON.stringify(userActivities));
      }
      
      function loadUserActivities() {
        if (!currentUser) return;
        
        // Load activities from localStorage
        userActivities = JSON.parse(localStorage.getItem(`activities_${currentUser.id}`) || '[]');
        
        // Render activities
        renderUserActivities();
      }
      
      function renderUserActivities() {
        const activityList = document.getElementById('activity-list');
        
        // Clear current list
        activityList.innerHTML = '';
        
        if (userActivities.length === 0) {
          activityList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #a0a0a0">
              No activities yet. Start exploring recommendations!
            </div>
          `;
          return;
        }
        
        // Render each activity
        userActivities.forEach(activity => {
          const date = new Date(activity.timestamp);
          const formattedDate = `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
          
          let icon = '📋';
          let category = 'General';
          
          if (activity.type === 'movie-recommendations') {
            icon = '🎬';
            category = 'Movies';
          } else if (activity.type === 'music-recommendations') {
            icon = '🎵';
            category = 'Music';
          } else if (activity.type === 'book-recommendations') {
            icon = '📚';
            category = 'Books';
          }
          
          const activityItem = document.createElement('div');
          activityItem.className = 'activity-item';
          activityItem.innerHTML = `
            <div class="activity-icon">${icon}</div>
            <div class="activity-details">
              <div class="activity-title">${activity.title}</div>
              <div class="activity-time">${formattedDate}</div>
            </div>
            <div class="activity-category">${category}</div>
          `;
          
          activityList.appendChild(activityItem);
        });
      }
      
      function showUserActivity() {
        // Hide selection screen
        document.getElementById("selection-screen").style.display = "none";
        
        // Hide all content sections
        const contentSections = document.querySelectorAll(".content-section");
        contentSections.forEach((section) => {
          section.classList.remove("active");
        });
        
        // Show activity section
        document.getElementById("user-activity").classList.add("active");
        
        // Refresh activities
        renderUserActivities();
      }
      
      // Window click event to close modal if clicking outside
      window.onclick = function(event) {
        const modal = document.getElementById('auth-modal');
        if (event.target === modal) {
          closeAuthModal();
        }
      };

