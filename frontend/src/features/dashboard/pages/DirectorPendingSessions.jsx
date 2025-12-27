  import React, { useState } from 'react';
import { useGetPendingSessionsQuery, useApproveSessionForSubmissionMutation } from '../api/directorApi';
import { Download, Upload, FileText, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { lawyerApi } from '../../lawyer/api/lawyerApi';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/index';

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'lawyer_memorandums');
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
    { method: 'POST', body: formData }
  );
  const data = await res.json();
  return data.secure_url;
};

export default function DirectorPendingSessions() {
  const { t } = useTranslation('directorpendingsessions');
  const dispatch = useDispatch();
  const { data, isLoading, isError, refetch } = useGetPendingSessionsQuery();
  const [approveMutation] = useApproveSessionForSubmissionMutation();
  const [uploadingFor, setUploadingFor] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState({}); // { sessionId: file }
  const [sessionNotes, setSessionNotes] = useState({}); // { sessionId: notes }

  const pendingSessions = data?.data || [];
  const isRTL = i18n.language === 'ar';

  const handleFileSelect = (sessionId, e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFiles(prev => ({ ...prev, [sessionId]: file }));
    }
  };

  const handleApprove = async (caseId, sessionId) => {
    try {
      let signatureUrl = '';
      const selectedFile = selectedFiles[sessionId];
      if (selectedFile) {
        setUploadingFor(sessionId);
        signatureUrl = await uploadToCloudinary(selectedFile);
      }

      await approveMutation({
        caseId,
        sessionId,
        body: { signatureUrl, additionalDocuments: [], notes: sessionNotes[sessionId] || '' },
      }).unwrap();

      toast.success(t('approveSuccess'));
      
      // Clear only this session's data
      setSelectedFiles(prev => {
        const newState = { ...prev };
        delete newState[sessionId];
        return newState;
      });
      setSessionNotes(prev => {
        const newState = { ...prev };
        delete newState[sessionId];
        return newState;
      });
      
      setUploadingFor(null);
      refetch();
      dispatch(lawyerApi.util.invalidateTags(['Sessions']));
    } catch (err) {
      toast.error(err?.data?.message || t('approveError'));
      setUploadingFor(null);
    }
  };

  if (isLoading) return <div>{t('loading')}</div>;
  if (isError) return <div className="text-red-600">{t('loadError')}</div>;

  return (
    <div
      className={`space-y-6 pt-16 px-4 sm:px-6 md:px-8 lg:px-10 ${
        isRTL ? 'lg:mr-[190px] text-right' : 'lg:ml-[190px] text-left'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <h1 className="text-2xl sm:text-3xl text-[#0B1F3B] font-bold">{t('pendingSessionsTitle')}</h1>
        <div className="text-sm text-gray-600 mt-1 sm:mt-0">
          {t('pendingCount', { count: pendingSessions.length })}
        </div>
      </div>

      {pendingSessions.length === 0 ? (
        <div className="p-6 bg-white rounded-lg shadow-sm text-center">{t('noPendingSessions')}</div>
      ) : (
        <div className="flex flex-col gap-4">
          {pendingSessions.map(({ session, case: caseInfo }) => (
            <div key={session._id} className="bg-white p-4 rounded-lg border w-full">
              <div className={`flex flex-col md:flex-row md:justify-between md:items-start gap-2 md:gap-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                <div>
                  <h3 className="font-semibold text-[#0B1F3B]">
                    {caseInfo.caseNumber} — {t('session')} #{session.sessionNumber}
                  </h3>
                  <p className="text-sm text-[#0B1F3B]">
                    {t('client')}: {caseInfo.clientId?.name}
                  </p>
                </div>
                <div className="text-sm text-gray-500">{new Date(session.createdAt).toLocaleString()}</div>
              </div>

              <div className="mt-4 space-y-4">
                {/* Documents uploaded by Secretary/Lawyer */}
                {session.documents && session.documents.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm font-semibold text-[#0B1F3B] mb-3">
                      {t('uploadedDocuments') || 'Documents Uploaded by Secretary/Lawyer'}
                    </p>
                    <div className="space-y-2">
                      {session.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white rounded-md p-3 border border-blue-100">
                          <div className="flex items-center gap-2">
                            <FileText size={16} className="text-blue-600" />
                            <span className="text-sm text-gray-700">
                              {doc.name || `Document ${idx + 1}`}
                            </span>
                          </div>
                          <a
                            href={doc.url || doc.fileUrl}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Download size={14} />
                            {t('download') || 'Download'}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Memorandum - Uploaded by Lawyer */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText size={18} className="text-blue-700" />
                      <p className="text-sm font-bold text-blue-900 uppercase tracking-wide">
                        {t('memorandum') || 'Memorandum by Lawyer'}
                      </p>
                    </div>
                    {session.memorandum?.fileUrl ? (
                      <div className="space-y-2">
                        <div className="bg-white rounded-md p-3 border border-blue-200">
                          <p className="text-xs text-gray-600 mb-2">
                            {t('preparedBy') || 'Prepared by'}: {session.memorandum.preparedBy?.name || 'Lawyer'}
                          </p>
                          <a
                            href={session.memorandum.fileUrl}
                            className="flex items-center gap-2 text-blue-700 hover:text-blue-900 font-semibold transition-colors"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Download size={18} />
                            <span>{t('downloadMemorandum') || 'Download & Review Memorandum'}</span>
                          </a>
                        </div>
                        {session.memorandum.status && (
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              session.memorandum.status === 'APPROVED' 
                                ? 'bg-green-100 text-green-700' 
                                : session.memorandum.status === 'SUBMITTED'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {session.memorandum.status}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-white rounded-md p-3 border border-blue-200">
                        <p className="text-sm text-gray-500 italic">{t('noMemorandum') || 'No memorandum uploaded yet'}</p>
                      </div>
                    )}
                  </div>

                  {/* Upload Director's Signature/Document */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm font-semibold text-[#0B1F3B] mb-2">
                      {t('uploadSignature')}
                    </p>
                    
                    {selectedFiles[session._id] ? (
                      <div className="flex items-center justify-between bg-white rounded-md p-3 border border-green-200">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-green-600" />
                          <span className="text-sm text-gray-700 truncate max-w-[200px]">
                            {selectedFiles[session._id].name}
                          </span>
                        </div>
                        <button
                          onClick={() => setSelectedFiles(prev => {
                            const newState = { ...prev };
                            delete newState[session._id];
                            return newState;
                          })}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Remove file"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={(e) => handleFileSelect(session._id, e)}
                          className="hidden"
                          id={`file-upload-${session._id}`}
                        />
                        <label
                          htmlFor={`file-upload-${session._id}`}
                          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                        >
                          <Upload size={24} className="text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">
                            {t('clickToUpload') || 'Click to upload'}
                          </span>
                          <span className="text-xs text-gray-400 mt-1">
                            PDF, PNG, JPG
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-[#0B1F3B] mb-2">
                    {t('notes')}
                  </p>
                  <textarea
                    value={sessionNotes[session._id] || ''}
                    onChange={(e) => setSessionNotes(prev => ({ ...prev, [session._id]: e.target.value }))}
                    rows={3}
                    placeholder={t('addNotesPlaceholder') || 'Add any notes or comments...'}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className={`mt-4 flex flex-col sm:flex-row sm:justify-end gap-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                <button
                  onClick={() => handleApprove(caseInfo._id, session._id)}
                  disabled={uploadingFor === session._id}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  {uploadingFor === session._id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      {t('uploading')}
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      {t('approveButton')}
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
