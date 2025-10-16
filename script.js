document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://randomuser.me/api/';
    const loadingElement = document.getElementById('loading');
    const profileContainer = document.getElementById('profile-container');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const handleTabs = (targetTab) => {
        tabContents.forEach(content => content.classList.remove('active'));
        tabButtons.forEach(btn => btn.classList.remove('active'));

        document.getElementById(targetTab).classList.add('active');
        document.querySelector(`.tab-btn[data-tab="${targetTab}"]`).classList.add('active');
    };

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            handleTabs(targetTab);
        });
    });

    const fetchData = async () => {
        try {
            loadingElement.classList.remove('hidden');
            profileContainer.classList.add('hidden');

            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`Data fetching failed: HTTP Status Code ${response.status}`);
            }
            const data = await response.json();
            const user = data.results[0];

            populateProfile(user);

        } catch (error) {
            console.error("An error occurred:", error);
            loadingElement.innerHTML = `<p style="color: #ff6347; font-size: 1.2em; padding: 20px;">
                                            ⚠️ Failed to load profile. ${error.message}. <br> Please try refreshing the page.
                                        </p>`;
        } finally {
            loadingElement.classList.add('hidden');
            profileContainer.classList.remove('hidden');
        }
    };

    const populateProfile = (user) => {
        const fullName = `${user.name.title}. ${user.name.first} ${user.name.last}`;
        const genderEN = user.gender === 'male' ? 'Male' : 'Female';
        const locationFull = `${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state}, ${user.location.postcode}, ${user.location.country}`;
        
        document.getElementById('profile-picture').src = user.picture.large;
        document.getElementById('user-name').textContent = fullName;
        document.getElementById('user-username').textContent = `@${user.login.username}`;
        document.getElementById('user-age-gender').textContent = `${user.dob.age} Years Old | ${genderEN}`;
        
        document.getElementById('user-dob-date').textContent = formatDate(user.dob.date);
        document.getElementById('user-age').textContent = `${user.dob.age} years`;
        document.getElementById('user-nationality').textContent = user.nat;
        document.getElementById('user-location-full').textContent = locationFull;

        document.getElementById('user-email').textContent = user.email;
        document.getElementById('user-phone').textContent = user.phone;
        document.getElementById('user-cell').textContent = user.cell; 

        document.getElementById('user-login-username').textContent = user.login.username;
        document.getElementById('user-login-uuid').textContent = user.login.uuid;
        document.getElementById('user-registered-date').textContent = formatDate(user.registered.date);
    };

    fetchData(); 
});