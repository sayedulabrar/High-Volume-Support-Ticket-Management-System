import apiClient from './axiosConfig';

export type TicketStatus = 'open' | 'in progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high';

export interface Ticket {
  id: number;
  subject: string;
  description: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  user_id: number;
  assigned_to: number | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  assigned_agent?: {
    id: number;
    name: string;
    email: string;
  } | null;
}

export interface TicketReply {
  id: number;
  ticket_id: number;
  user_id: number;
  message: string;
  created_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface TicketFormData {
  subject: string;
  category: string;
  priority: string;
  description: string;
}

export interface TicketReplyFormData {
  message: string;
}

export interface TicketFilterParams {
  category?: string;
  priority?: TicketPriority;
  status?: TicketStatus;
  assigned_to?: number;
}

export const ticketApi = {
  // Customer endpoints
  getCustomerTickets: async (filters: TicketFilterParams): Promise<Ticket[]> => {
    try {
      const response = await apiClient.get('/customer/tickets', {
      params: filters, // this converts object to ?key=value&key2=value2
    });
      return response.data.tickets;
    } catch (error: any) {
      console.error('Error fetching customer tickets:', error);
      throw new Error(error.message || 'Failed to fetch customer tickets');
    }
  },

  getCustomerTicket: async (id: number): Promise<Ticket> => {
    try {
      const response = await apiClient.get(`/customer/tickets/${id}`);
      return response.data.ticket ?? response.data;
    } catch (error: any) {
      console.error(`Error fetching customer ticket with ID ${id}:`, error);
      throw new Error(error.message || 'Failed to fetch customer ticket');
    }
  },

  createTicket: async (data: TicketFormData) => {
    try {
      const formData = new FormData();
      formData.append('subject', data.subject);
      formData.append('category', data.category);
      formData.append('priority', data.priority);
      formData.append('description', data.description);

      const response = await apiClient.post('/customer/tickets', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data.ticket ?? response.data;
    } catch (error: any) {
      console.error('Error creating ticket:', error);
      throw new Error(error.message || 'Failed to create ticket');
    }
  },

  // Support Agent endpoints
  getAgentTickets: async (filters: TicketFilterParams): Promise<Ticket[]> => {
    try {
      const response = await apiClient.get('/support-agent/tickets', {
      params: filters, // this converts object to ?key=value&key2=value2
    });
      return response.data.tickets;
    } catch (error: any) {
      console.error('Error fetching agent tickets:', error);
      throw new Error(error.message || 'Failed to fetch agent tickets');
    }
  },

  getAgentTicket: async (id: number): Promise<Ticket> => {
    try {
      const response = await apiClient.get(`/support-agent/tickets/${id}`);
      return response.data.ticket ?? response.data;
    } catch (error: any) {
      console.error(`Error fetching agent ticket with ID ${id}:`, error);
      throw new Error(error.message || 'Failed to fetch agent ticket');
    }
  },

  updateTicketStatus: async (id: number, status: TicketStatus): Promise<any> => {
    try {
      const response = await apiClient.post(`/support-agent/tickets/${id}/updateStatus`, { status });
      return response.data.ticket ?? response.data;
    } catch (error: any) {
      console.error(`Error updating ticket status for ID ${id}:`, error);
      throw new Error(error.message || 'Failed to update ticket status');
    }
  },

  // Admin endpoints
  assignTicket: async (id: number, agentId: number): Promise<any> => {
    try {
      const response = await apiClient.put(`/admin/tickets/${id}/assign`, { assigned_to: agentId });
      return response.data.ticket ?? response.data;
    } catch (error: any) {
      console.error(`Error assigning ticket ID ${id} to agent ID ${agentId}:`, error);
      throw new Error(error.message || 'Failed to assign ticket');
    }
  },

getAdminTickets: async (filters: TicketFilterParams): Promise<Ticket[]> => {
  try {
    const response = await apiClient.get('/admin/tickets', {
      params: filters, // this converts object to ?key=value&key2=value2
    });
    return response.data.tickets;
  } catch (error: any) {
    console.error('Error fetching admin tickets:', error);
    throw new Error(error.message || 'Failed to fetch admin tickets');
  }
},


  // Common endpoints for replies
  getTicketReplies: async (
    ticketId: number,
    role: 'Customer' | 'Support Agent'
  ): Promise<TicketReply[]> => {
    const prefix = role === 'Customer' ? 'customer' : 'support-agent';
    try {
      const response = await apiClient.get(`/${prefix.toLowerCase()}/tickets/${ticketId}/replies`);
      console.log(`Fetched replies for ticket ID ${ticketId} as ${role}`);
      console.log('Response data:', response.data);
      return response.data.replies;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('Unauthorized to view these replies');
      }
      console.error(`Error fetching replies for ticket ID ${ticketId}:`, error);
      throw new Error(error.message || 'Failed to fetch ticket replies');
    }
  },

  createTicketReply: async (
    ticketId: number,
    data: TicketReplyFormData,
    role: 'Customer' | 'Support Agent'
  ): Promise<any> => {
    const prefix = role === 'Customer' ? 'customer' : 'support-agent';
    const formData = new FormData();
    formData.append('message', data.message);
    

    try {
      const response = await apiClient.post(`/${prefix}/tickets/${ticketId}/replies`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.reply ?? response.data;
    } catch (error: any) {
      console.error(`Error creating reply for ticket ID ${ticketId}:`, error);
      throw new Error(error.message || 'Failed to create ticket reply');
    }
  },
};

