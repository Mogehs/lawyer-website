import React, { useState } from 'react';
import { useGetPendingSessionsQuery, useApproveSessionForSubmissionMutation } from '../api/directorApi';
import { Download, Upload } from 'lucide-react';
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [notes, setNotes] = useState('');

  const pendingSessions = data?.data || [];
  const isRTL = i18n.language === 'ar';

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

      await approveMutation({
        caseId,
        sessionId,
        body: { signatureUrl, additionalDocuments: [], notes },
      }).unwrap();

      toast.success(t('approveSuccess'));
      setSelectedFile(null);
      setNotes('');
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

              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Memorandum */}
                <div>
                  <p className="text-xs text-gray-500">{t('memorandum')}</p>
                  {session.memorandum?.fileUrl ? (
                    <a
                      href={session.memorandum.fileUrl}
                      className="text-blue-600 hover:underline flex items-center gap-2"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Download size={14} /> {t('download')}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-500 italic">{t('noMemorandum')}</p>
                  )}
                </div>

                {/* Upload */}
                <div>
                  <p className="text-xs text-gray-500">{t('uploadSignature')}</p>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg"
                    onChange={handleFileSelect}
                    className="mt-2 w-full max-w-full"
                  />
                </div>

                {/* Notes */}
                <div>
                  <p className="text-xs text-gray-500">{t('notes')}</p>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full max-w-full rounded-md border px-3 py-2 mt-2"
                  />
                </div>
              </div>

              <div className={`mt-3 flex flex-col sm:flex-row sm:justify-end gap-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                <button
                  onClick={() => handleApprove(caseInfo._id, session._id)}
                  disabled={uploadingFor === session._id}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg w-full sm:w-auto"
                >
                  {uploadingFor === session._id ? t('uploading') : <><Upload size={14} /> {t('approveButton')}</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
