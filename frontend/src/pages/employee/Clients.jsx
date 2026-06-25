import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function EmployeeClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    fetchMyClients();
  }, []);

  const fetchMyClients = async () => {
    try {
      setLoading(true);
      const res = await api.get('/clients');
      setClients(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch your clients');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = (client) => {
    setSelectedClient(client);
    setIsDetailOpen(true);
  };

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.industry && c.industry.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c.contactName && c.contactName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">My Assigned Clients</h1>
        <p className="text-outline mt-1.5">View and manage accounts assigned to you for candidate recruitment.</p>
      </div>

      {/* Error notice */}
      {error && (
        <div className="p-4 bg-error-container text-on-error-container rounded-2xl flex items-center gap-3">
          <span className="material-symbols-outlined">error</span>
          <span className="text-body-md font-medium">{error}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="card p-6 max-w-md">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">
            search
          </span>
          <input
            type="text"
            placeholder="Search my clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-12"
          />
        </div>
      </div>

      {/* Grid listing */}
      {loading ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-outline text-body-md">Loading your accounts...</p>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="card p-12 text-center max-w-sm mx-auto space-y-4">
          <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center text-outline mx-auto">
            <span className="material-symbols-outlined text-3xl">domain_disabled</span>
          </div>
          <div>
            <h4 className="text-title-lg font-bold text-on-surface">No clients assigned</h4>
            <p className="text-body-md text-outline mt-1">
              You are currently not assigned to any clients. Contact your administrator to assign you client accounts.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <div 
              key={client.id} 
              onClick={() => handleOpenDetail(client)}
              className="card-hover p-0 overflow-hidden flex flex-col justify-between h-full cursor-pointer border border-outline-variant/30 rounded-2xl bg-surface"
            >
              {/* Highlight Banner for Position */}
              {client.recruitmentPositionRequired ? (
                <div className="bg-primary/10 border-b border-primary/20 px-6 py-3 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-primary">
                     <span className="material-symbols-outlined text-[18px]">work</span>
                     <span className="text-xs font-bold uppercase tracking-wider">Hiring For</span>
                   </div>
                   <span className="text-primary font-bold text-sm bg-primary/20 px-3 py-1 rounded-full truncate max-w-[150px] text-right">
                     {client.recruitmentPositionRequired}
                   </span>
                </div>
              ) : (
                <div className="h-2 w-full bg-gradient-to-r from-surface-container-high to-surface-container"></div>
              )}
              
              <div className="p-6 flex-1 flex flex-col space-y-6">
                <div className="space-y-5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface shadow-sm border border-outline-variant/50 shrink-0">
                      <span className="material-symbols-outlined text-2xl">domain</span>
                    </div>
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {client.industry && (
                        <span className="text-[10px] font-semibold px-2 py-1 bg-surface-container border border-outline-variant/30 text-on-surface-variant rounded-md uppercase tracking-wide">
                          {client.industry}
                        </span>
                      )}
                      {client.companyType && (
                        <span className="text-[10px] font-semibold px-2 py-1 bg-surface-container border border-outline-variant/30 text-on-surface-variant rounded-md uppercase tracking-wide">
                          {client.companyType}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Company details */}
                  <div>
                    <h3 className="text-title-lg font-extrabold text-on-surface tracking-tight leading-snug line-clamp-2" title={client.name}>{client.name}</h3>
                    
                    <div className="mt-3 space-y-2.5">
                      {client.website && (
                        <a
                          href={client.website.startsWith('http') ? client.website : `https://${client.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-body-sm text-outline hover:text-primary transition-colors flex items-center gap-2 font-medium w-fit"
                        >
                          <span className="material-symbols-outlined text-[16px]">public</span>
                          <span className="truncate max-w-[200px]">{client.website}</span>
                        </a>
                      )}
                      {(client.companyAddress || client.city || client.state) && (
                        <div className="text-body-sm text-outline flex items-start gap-2 font-medium">
                          <span className="material-symbols-outlined text-[16px] mt-0.5 shrink-0">location_on</span>
                          <span className="line-clamp-2">
                            {[client.companyAddress, client.city, client.state].filter(Boolean).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-1"></div>

                {/* Contact information */}
                <div className="bg-surface-container-lowest border border-outline-variant/30 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-3 border-b border-outline-variant/30 pb-2">
                    <span className="material-symbols-outlined text-[16px] text-primary">person</span>
                    <p className="text-label-sm font-bold text-on-surface uppercase tracking-wider">Primary Contact</p>
                  </div>
                  <div className="space-y-2.5">
                    <div className="font-semibold text-on-surface text-body-sm truncate" title={client.contactName || 'No contact specified'}>
                      {client.contactName || 'No contact specified'}
                    </div>
                    {client.email && (
                      <a 
                        href={`mailto:${client.email}`} 
                        onClick={(e) => e.stopPropagation()}
                        className="text-body-sm text-outline hover:text-primary transition-colors flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[14px]">mail</span>
                        <span className="truncate">{client.email}</span>
                      </a>
                    )}
                    {client.phone && (
                      <div className="text-body-sm text-outline flex items-center gap-2">
                        <span className="material-symbols-outlined text-[14px]">phone</span>
                        <span className="truncate">{client.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Client Detail Drawer */}
      {isDetailOpen && selectedClient && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-sm flex items-center justify-end z-50">
          <div className="card w-full max-w-md h-full shadow-2xl p-8 overflow-y-auto scrollbar-thin space-y-8 rounded-none rounded-l-3xl bg-surface-container-lowest animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between">
              <h2 className="text-headline-md font-bold text-on-surface">Client Account Details</h2>
              <button onClick={() => setIsDetailOpen(false)} className="btn-icon">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Identity */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center text-white shadow-md shrink-0">
                <span className="material-symbols-outlined text-3xl">domain</span>
              </div>
              <div>
                <h3 className="text-title-lg font-extrabold text-on-surface leading-tight">{selectedClient.name}</h3>
                <p className="text-body-md text-outline mt-0.5">{selectedClient.industry || 'No Industry Type Specified'}</p>
              </div>
            </div>

            {/* Highlight Banner for Position in Drawer */}
            {selectedClient.recruitmentPositionRequired && (
              <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                 <div className="flex items-center gap-4 text-primary">
                   <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                     <span className="material-symbols-outlined text-[24px]">work</span>
                   </div>
                   <div>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-primary/80 mb-0.5">Actively Hiring For</p>
                     <p className="text-title-md font-extrabold">{selectedClient.recruitmentPositionRequired}</p>
                   </div>
                 </div>
              </div>
            )}

            {/* General Info Grid */}
            <div className="bg-surface-container-low p-5 rounded-2xl space-y-4 border border-outline-variant/30">
              <h4 className="text-label-md font-bold text-outline uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">info</span>
                Company Information
              </h4>
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-label-md text-outline font-semibold">Company Type</p>
                  <p className="text-body-md text-on-surface font-semibold mt-0.5">{selectedClient.companyType || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-label-md text-outline font-semibold">Website</p>
                  {selectedClient.website ? (
                    <a
                      href={selectedClient.website.startsWith('http') ? selectedClient.website : `https://${selectedClient.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-body-md text-primary hover:underline font-semibold inline-flex items-center gap-1.5 mt-0.5 break-all"
                    >
                      <span className="material-symbols-outlined text-[16px] shrink-0">public</span>
                      {selectedClient.website}
                    </a>
                  ) : (
                    <p className="text-body-md text-on-surface font-semibold mt-0.5">N/A</p>
                  )}
                </div>
                <div className="col-span-2">
                  <p className="text-label-md text-outline font-semibold">Full Address</p>
                  <p className="text-body-md text-on-surface-variant font-medium leading-relaxed mt-0.5 flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px] text-outline mt-0.5 shrink-0">location_on</span>
                    <span>{[selectedClient.companyAddress, selectedClient.city, selectedClient.state].filter(Boolean).join(', ') || 'N/A'}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Person Block */}
            <div className="bg-surface-container-low p-5 rounded-2xl space-y-4">
              <h4 className="text-label-md font-bold text-outline uppercase tracking-wider mb-2">Primary Contact Person</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-label-md text-outline font-semibold">Name</p>
                  <p className="text-body-md text-on-surface font-semibold mt-0.5">{selectedClient.contactName || 'No contact specified'}</p>
                </div>
                {selectedClient.email && (
                  <div>
                    <p className="text-label-md text-outline font-semibold">Email Address</p>
                    <a href={`mailto:${selectedClient.email}`} onClick={(e) => e.stopPropagation()} className="text-body-md text-primary hover:underline flex items-center gap-1.5 mt-0.5 font-medium">
                      <span className="material-symbols-outlined text-[16px]">mail</span>
                      {selectedClient.email}
                    </a>
                  </div>
                )}
                {selectedClient.phone && (
                  <div>
                    <p className="text-label-md text-outline font-semibold">Contact Details (Phone)</p>
                    <div className="text-body-md text-on-surface-variant flex items-center gap-1.5 mt-0.5 font-medium">
                      <span className="material-symbols-outlined text-[16px]">phone</span>
                      {selectedClient.phone}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer info */}
            <div className="border-t border-outline-variant/30 pt-6 text-label-md text-outline flex flex-col gap-1">
              <p>Account ID: <span className="font-mono text-xs">{selectedClient.id}</span></p>
              <p>Assigned on: {new Date(selectedClient.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="pt-2">
              <button onClick={() => setIsDetailOpen(false)} className="btn-primary w-full py-2.5">
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
