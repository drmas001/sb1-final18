import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Patient } from '../types';
import { UserMinus, Calendar, Clock, Search } from 'lucide-react';

interface DischargeListProps {
  patients: Patient[];
  onRequestDischarge: (patientId: string, dischargeNotes: string) => Promise<Patient>;
}

const DischargeList: React.FC<DischargeListProps> = ({ patients, onRequestDischarge }) => {
  const [searchMRN, setSearchMRN] = useState('');
  const [searchResult, setSearchResult] = useState<Patient | null>(null);
  const [dischargeNotes, setDischargeNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDischarging, setIsDischarging] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const foundPatient = patients.find(patient => patient.mrn === searchMRN);
    setSearchResult(foundPatient || null);
    setError(foundPatient ? null : 'No active patient found with the given MRN.');
  };

  const handleRequestDischarge = async () => {
    if (searchResult) {
      setIsDischarging(true);
      setError(null);
      try {
        await onRequestDischarge(searchResult.id, dischargeNotes);
        setSearchMRN('');
        setSearchResult(null);
        setDischargeNotes('');
        navigate('/'); // Navigate to home screen after successful discharge
      } catch (error: any) {
        setError(`An error occurred while requesting discharge: ${error.message}`);
      } finally {
        setIsDischarging(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 flex items-center">
        <UserMinus className="mr-2" />
        Discharge Patients
      </h2>

      <form onSubmit={handleSearch} className="flex items-center space-x-2">
        <input
          type="text"
          value={searchMRN}
          onChange={(e) => setSearchMRN(e.target.value)}
          placeholder="Enter patient MRN"
          className="input flex-grow"
        />
        <button type="submit" className="btn btn-primary">
          <Search className="w-5 h-5 mr-2" />
          Search
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {searchResult && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {/* Patient information display */}
          {/* ... (keep the existing patient information display) ... */}
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <textarea
              value={dischargeNotes}
              onChange={(e) => setDischargeNotes(e.target.value)}
              placeholder="Enter discharge notes..."
              className="w-full p-2 mb-2 border rounded"
              rows={3}
            />
            <button
              onClick={handleRequestDischarge}
              disabled={isDischarging || !dischargeNotes.trim()}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {isDischarging ? 'Discharging...' : 'Request Discharge'}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Active Patients</h3>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {patients.map(patient => (
              <li key={patient.id} className="px-4 py-4 sm:px-6">
                {/* Patient list item */}
                {/* ... (keep the existing patient list item) ... */}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DischargeList;