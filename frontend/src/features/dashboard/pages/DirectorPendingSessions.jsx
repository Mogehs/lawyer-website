import React, { useState } from 'react';
import { useGetPendingSessionsQuery, useApproveSessionForSubmissionMutation } from '../api/directorApi';
import { Download, Upload, FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { lawyerApi } from '../../lawyer/api/lawyerApi';

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'lawyer_memorandums');
  const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  return data.secure_url;
};

export default function DirectorPendingSessions() {
  const dispatch = useDispatch();
  const { data, isLoading, isError, refetch } = useGetPendingSessionsQuery();
  const [approveMutation] = useApproveSessionForSubmissionMutation();
  const [uploadingFor, setUploadingFor] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [notes, setNotes] = useState('');

  const pendingSessions = data?.data || [];

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleApprove = async (caseId, sessionId) => {
    try {
      let signatureUrl = '';
      if (selectedFile) {
        setUploadingFor(sessionId);
        signatureUrl = await uploadToCloudinary(selectedFile);
      }

      await approveMutation({ caseId, sessionId, body: { signatureUrl, additionalDocuments: [], notes } }).unwrap();
      toast.success('Session approved and marked ready for submission');
      setSelectedFile(null);
      setNotes('');
      setUploadingFor(null);
      refetch();
      // Invalidate lawyer sessions cache so assigned lawyers immediately see the session
      dispatch(lawyerApi.util.invalidateTags(['Sessions']));
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to approve session');
      setUploadingFor(null);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div className="text-red-600">Failed to load pending sessions</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pending Sessions for Signature</h1>
        <div className="text-sm text-gray-600">{pendingSessions.length} pending</div>
      </div>

      {pendingSessions.length === 0 ? (
        <div className="p-6 bg-white rounded-lg shadow-sm text-center">No pending sessions</div>
      ) : (
        <div className="grid gap-4">
          {pendingSessions.map(({ session, case: caseInfo }) => (
            <div key={session._id} className="bg-white p-4 rounded-lg border">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{caseInfo.caseNumber} — Session #{session.sessionNumber}</h3>
                  <p className="text-sm text-gray-600">Client: {caseInfo.clientId?.name}</p>
                </div>
                <div className="text-sm text-gray-500">{new Date(session.createdAt).toLocaleString()}</div>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Memorandum</p>
                  {session.memorandum?.fileUrl ? (
                    <a href={session.memorandum.fileUrl} className="text-blue-600 hover:underline flex items-center gap-2" target="_blank" rel="noreferrer">
                      <Download size={14} /> Download
                    </a>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No memorandum file</p>
                  )}
                </div>

                <div>
                  <p className="text-xs text-gray-500">Upload Signature / Final Document</p>
                  <input type="file" accept=".pdf,.png,.jpg" onChange={handleFileSelect} className="mt-2" />
                </div>

                <div>
                  <p className="text-xs text-gray-500">Notes</p>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full rounded-md border px-3 py-2 mt-2" />
                </div>
              </div>

              <div className="mt-3 flex gap-2 justify-end">
                <button onClick={() => handleApprove(caseInfo._id, session._id)} disabled={uploadingFor === session._id} className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg">
                  {uploadingFor === session._id ? 'Uploading...' : (<><Upload size={14} /> Approve & Mark Ready</>)}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
