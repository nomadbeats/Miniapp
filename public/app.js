let currentTrackIndex = 0;
let isPlaying = false;
let musicTracks = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let playlists = JSON.parse(localStorage.getItem('playlists')) || [];

const API_BASE = '/api';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadAllTracks();
    setupEventListeners();
    renderAllTracks();
});

function setupEventListeners() {
    // Player controls
    document.getElementById('playBtn').addEventListener('click', togglePlay);
    document.getElementById('nextBtn').addEventListener('click', nextTrack);
    document.getElementById('prevBtn').addEventListener('click', prevTrack);
    document.getElementById('favoriteBtn').addEventListener('click', toggleFavorite);
    document.getElementById('progressBar').addEventListener('input', seek);
    document.getElementById('volumeSlider').addEventListener('input', changeVolume);

    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', switchTab);
    });

    // Search
    document.getElementById('searchInput').addEventListener('input', searchTracks);

    // Playlists
    document.getElementById('createPlaylistBtn').addEventListener('click', createPlaylist);
}

async function loadAllTracks() {
    try {
        const response = await fetch(`${API_BASE}/music`);
        musicTracks = await response.json();
    } catch (error) {
        console.error('Error loading tracks:', error);
        musicTracks = [
            { id: 1, title: 'Bohemian Rhapsody', artist: 'Queen', duration: 354 },
            { id: 2, title: 'Imagine', artist: 'John Lennon', duration: 183 }
        ];
    }
}

function renderAllTracks() {
    const container = document.getElementById('allTracks');
    container.innerHTML = '';
    musicTracks.forEach((track, index) => {
        container.appendChild(createTrackElement(track, index));
    });
}

function createTrackElement(track, index) {
    const div = document.createElement('div');
    div.className = `track-item ${currentTrackIndex === index && isPlaying ? 'playing' : ''}`;
    div.innerHTML = `
        <div class="track-details">
            <div class="track-title">${track.title}</div>
            <div class="track-meta">${track.artist} • ${track.album || 'Unknown'}</div>
        </div>
        <div class="track-duration">${formatTime(track.duration)}</div>
    `;
    div.addEventListener('click', () => playTrack(index));
    return div;
}

function togglePlay() {
    isPlaying = !isPlaying;
    updatePlayButton();
}

function updatePlayButton() {
    document.getElementById('playBtn').textContent = isPlaying ? '⏸️' : '▶️';
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % musicTracks.length;
    playTrack(currentTrackIndex);
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + musicTracks.length) % musicTracks.length;
    playTrack(currentTrackIndex);
}

function playTrack(index) {
    currentTrackIndex = index;
    isPlaying = true;
    const track = musicTracks[index];

    document.getElementById('currentTrack').textContent = track.title;
    document.getElementById('currentArtist').textContent = track.artist;
    document.getElementById('albumArt').src = track.image || 'https://via.placeholder.com/200';
    document.getElementById('duration').textContent = formatTime(track.duration);
    document.getElementById('progressBar').max = track.duration;

    updatePlayButton();
    updateFavoriteButton();
    renderAllTracks();
}

function seek(e) {
    document.getElementById('progress').style.width = (e.target.value / e.target.max) * 100 + '%';
    document.getElementById('currentTime').textContent = formatTime(e.target.value);
}

function changeVolume(e) {
    console.log('Volume:', e.target.value);
}

function toggleFavorite() {
    const track = musicTracks[currentTrackIndex];
    const index = favorites.findIndex(t => t.id === track.id);
    
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(track);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteButton();
}

function updateFavoriteButton() {
    const track = musicTracks[currentTrackIndex];
    const isFavorited = favorites.some(t => t.id === track.id);
    document.getElementById('favoriteBtn').textContent = isFavorited ? '❤️' : '🤍';
}

function switchTab(e) {
    const tabName = e.target.dataset.tab;
    
    // Hide all panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected pane and mark button as active
    document.getElementById(tabName).classList.add('active');
    e.target.classList.add('active');
    
    if (tabName === 'favorites') renderFavorites();
    if (tabName === 'playlists') renderPlaylists();
}

function searchTracks(e) {
    const query = e.target.value.toLowerCase();
    const container = document.getElementById('searchResults');
    container.innerHTML = '';
    
    const results = musicTracks.filter(track => 
        track.title.toLowerCase().includes(query) ||
        track.artist.toLowerCase().includes(query)
    );
    
    results.forEach((track, index) => {
        container.appendChild(createTrackElement(track, musicTracks.indexOf(track)));
    });
}

function renderFavorites() {
    const container = document.getElementById('favoritesList');
    container.innerHTML = '';
    
    favorites.forEach((track) => {
        const index = musicTracks.findIndex(t => t.id === track.id);
        if (index > -1) {
            container.appendChild(createTrackElement(track, index));
        }
    });
}

function createPlaylist() {
    const name = document.getElementById('playlistName').value.trim();
    if (!name) return;
    
    playlists.push({
        id: Date.now(),
        name: name,
        tracks: []
    });
    
    localStorage.setItem('playlists', JSON.stringify(playlists));
    document.getElementById('playlistName').value = '';
    renderPlaylists();
}

function renderPlaylists() {
    const container = document.getElementById('playlistList');
    container.innerHTML = '';
    
    playlists.forEach(playlist => {
        const div = document.createElement('div');
        div.className = 'playlist-item';
        div.innerHTML = `
            <div class="playlist-name">${playlist.name}</div>
            <div class="playlist-count">${playlist.tracks.length} songs</div>
        `;
        container.appendChild(div);
    });
}

function formatTime(seconds) {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
