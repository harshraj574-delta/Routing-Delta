const API_BASE_URL = 'http://localhost:5001/api';

export const profileService = {
  create: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/profiles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    if (!response.ok) throw new Error('Failed to create profile');
    return response.json();
  },

  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/profiles`);
    if (!response.ok) throw new Error('Failed to fetch profiles');
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/profiles/${id}`);
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  update: async (id, profileData) => {
    const response = await fetch(`${API_BASE_URL}/profiles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/profiles/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete profile');
    if (response.status === 204) return null;
    return response.json();
  }
};

export const facilityService = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/facilities`);
    if (!response.ok) throw new Error('Failed to fetch facilities');
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/facilities/${id}`);
    if (!response.ok) throw new Error('Failed to fetch facility');
    return response.json();
  },

  create: async (facilityData) => {
    const response = await fetch(`${API_BASE_URL}/facilities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(facilityData)
    });
    if (!response.ok) throw new Error('Failed to create facility');
    return response.json();
  },

  update: async (id, facilityData) => {
    const response = await fetch(`${API_BASE_URL}/facilities/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(facilityData)
    });
    if (!response.ok) throw new Error('Failed to update facility');
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/facilities/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete facility');
    return response.json();
  }
};

export const employeeService = {
  getEmployeeData: async (shift) => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees?shift=${shift}`);
      if (!response.ok) throw new Error('Failed to fetch employee data');
      return response.json();
    } catch (error) {
      console.error('Error fetching employee data:', error);
      throw error;
    }
  }
};

export const routeService = {
  create: async ({ profileId, date, shift, tripType, facilityId, routeData }) => {
    if (!profileId || !date || !shift || !tripType || !facilityId || !routeData) {
      throw new Error('Missing required fields: profileId, date, shift, tripType, facilityId, routeData');
    }
    
    // Validate that routeData has the required structure
    if (!Array.isArray(routeData)) {
      throw new Error('routeData must be an array');
    }
    
    routeData.forEach((route, index) => {
      if (!route.zone || !Array.isArray(route.employees)) {
        throw new Error(`Route at index ${index} must have zone and employees array properties`);
      }
    });

    const response = await fetch(`${API_BASE_URL}/routes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId, date, shift, tripType, facilityId, routeData })
    });
    if (!response.ok) throw new Error('Failed to create route');
    return response.json();
  },

  getByDateAndShift: async (date, shift) => {
    const response = await fetch(`${API_BASE_URL}/routes/by-date-shift?date=${date}&shift=${shift}`);
    if (!response.ok) throw new Error('Failed to fetch routes');
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/routes/${id}`);
    if (!response.ok) throw new Error('Failed to fetch route');
    return response.json();
  },

  getByProfile: async (profileId) => {
    const response = await fetch(`${API_BASE_URL}/routes/profile/${profileId}`);
    if (!response.ok) throw new Error('Failed to fetch routes');
    return response.json();
  }
};