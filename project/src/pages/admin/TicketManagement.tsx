import { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { Ticket, ticketApi } from '../../api/ticketApi';
import { Role, authApi } from '../../api/authApi';
import { Dialog } from '../../components/ui/dialogue';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import PriorityBadge  from '../../components/ui/PriorityBadge';
import StatusBadge from '../../components/ui/StatusBadge';

const TicketAdminPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState('');
  const [agents, setAgents] = useState<any[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<any[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const data = await ticketApi.getAdminTickets({});
      setTickets(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignClick = async (ticketId: number) => {
    setSelectedTicketId(ticketId);
    setIsDialogOpen(true);

    try {
      const roles: Role[] = await authApi.getRoles();
      const supportRole = roles.find((r) => r.name === 'Support Agent');
      if (supportRole) {
        const users = await adminApi.getUsers(supportRole.id);
        setAgents(users);
        setFilteredAgents(users);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    const filtered = agents.filter((a) =>
      a.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredAgents(filtered);
  };

  const handleAssignAgent = async () => {
    if (!selectedTicketId || !selectedAgentId) return;

    try {
      await ticketApi.assignTicket(selectedTicketId, selectedAgentId);
      await fetchTickets();
      setIsDialogOpen(false);
      setSelectedTicketId(null);
      setSelectedAgentId(null);
      setSearchText('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Ticket Dashboard</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              <th className="p-3">Subject</th>
              <th className="p-3">Category</th>
              <th className="p-3">Priority</th>
              <th className="p-3">Status</th>
              <th className="p-3">Assigned To</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="border-t hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <td className="p-3">{ticket.subject}</td>
                <td className="p-3">{ticket.category}</td>
                <td className="p-3 capitalize"><PriorityBadge priority={ticket.priority} /></td>
                <td className="p-3 capitalize"><StatusBadge status={ticket.status} /></td>
                <td className="p-3">
                  {ticket.assigned_agent ? ticket.assigned_agent.name : (
                    <span className="italic text-gray-400">Unassigned</span>
                  )}
                </td>
                <td className="p-3">
                  <Button
                    onClick={() => handleAssignClick(ticket.id)}
                    disabled={ticket.assigned_to !== null}
                    className="w-full"
                  >
                    Assign Ticket
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <div className="p-6 max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Assign to Agent</h2>
          <Input
            value={searchText}
            onChange={(e: any) => handleSearch(e.target.value)}
            placeholder="Search agents by name"
            className="mb-4"
          />
          <div className="max-h-60 overflow-y-auto space-y-2">
            {filteredAgents.map((agent) => (
              <div
                key={agent.id}
                onClick={() => setSelectedAgentId(agent.id)}
                className={`cursor-pointer p-2 rounded border transition ${
                  selectedAgentId === agent.id
                    ? 'bg-blue-100 dark:bg-blue-900 border-blue-500'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span className="font-medium">{agent.name}</span>{' '}
                <span className="text-sm text-gray-500">({agent.email})</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={handleAssignAgent} disabled={!selectedAgentId}>
              Confirm Assignment
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default TicketAdminPage;
