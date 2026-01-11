import React, { useEffect, useRef, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { toast } from "sonner";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import SpotifyAudioPlayer from '@/components/SpotifyAudioPlayer';

interface JournalEntry {
  id: number;
  text_content: string;
  media_path?: string;
  media_type: 'text' | 'audio' | 'application/pdf';
  created_at: string;
}


interface Props {
  journals: JournalEntry[];
  flash?: { success?: string };
}

const Index: React.FC<Props> = ({ journals, flash }) => {
  const { t } = useTranslation();
  const breadcrumbs: BreadcrumbItem[] = [
  {
    title: t("My Journal Entries"),
    href: '/journals',
  },
];

  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [results, setResults] = useState<Record<number, any>>({}); // store results by entry id

  // 🗑 Delete journal
  const handleDelete = () => {
    if (deleteId) {
      router.delete(`/journals/${deleteId}`, {
        onSuccess: () => console.log('Deleted successfully'),
      });
      setShowModal(false);
    }
  };

  // 🧠 Analyze emotion
  const handleAnalyze = async (entryId: number) => {
    setLoadingId(entryId);
  try {
    const response = await axios.post("/emotion/analyze", {
      journal_entry_id: entryId,
    });

    if (response.data.success) {
      const { emotion_label, confidence } = response.data.data;

      toast.success(`${t("Émotion détectée")} : ${emotion_label}`, {
        description: `Confiance : ${(confidence * 100).toFixed(1)}%`,
      });
    }
  } catch (error) {
    console.error(error);
    toast.error("❌ Failure to analyze emotions.");
  }finally{
    setLoadingId(null);
  }
};

const getMediaUrl = (path?: string): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${window.location.origin}/storage/uploads/${path}`;
};

// Track audio sources per journal entry to prevent autoplay
  const audioRefs = useRef<Record<number, HTMLAudioElement>>({});

useEffect(() => {
  // Pause all audios whenever the page is mounted or navigated back via Inertia
  Object.values(audioRefs.current).forEach((audio) => {
    audio.pause();
    audio.currentTime = 0; // optional: reset to start
  });
}, []);

const getMediaUrlSafe = (path?: string) =>
  path ? getMediaUrl(path) : "";

const isAudioFile = (url: string) =>
  /\.(mp3|wav|ogg|m4a)$/i.test(url);

const isPdfFile = (url: string) =>
  /\.pdf$/i.test(url);



  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="p-6">
        <Head title={t("My Journals")} />

        {flash?.success && (
          <div className="bg-green-100 text-green-800 p-2 rounded mb-4">
            {flash.success}
          </div>
        )}

        <h1 className="text-2xl font-bold mb-4">
          {t("My Journal Entries")}
        </h1>

        <ul className="space-y-4 max-w-4xl">
          {journals.length === 0 && (
            <li>{t("No journal entries yet")}</li>
          )}

          {journals.map((entry) => {
            const mediaUrl = getMediaUrlSafe(entry.media_path);

            const isAudio = isAudioFile(mediaUrl);
            const isPdf = isPdfFile(mediaUrl);

            return (
              <li
                key={entry.id}
                className="border p-4 rounded-lg shadow-sm bg-white flex justify-between items-start"
              >
                <div className="flex-1">
                  <p className="mb-2 text-gray-700">{entry.text_content}</p>

                  {/* AUDIO — ONLY */}
                  {isAudio && (
                    <SpotifyAudioPlayer src={mediaUrl} />
                  )}

                  {/* PDF — ONLY */}
                  {!isAudio && isPdf && (
                    <iframe
                      src={mediaUrl}
                      className="mt-2 w-full h-96 border rounded"
                      title={t("Document")}
                    />
                  )}

                  <p className="text-xl my-5 font-semibold text-gray-500">
                    MindTrackAI
                  </p>

                  <button
                    onClick={() => handleAnalyze(entry.id)}
                    disabled={loadingId === entry.id}
                    className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {loadingId === entry.id
                      ? t("Analyzing...")
                      : t("Analyze Emotion")}
                  </button>

                  {results[entry.id] && (
                    <div className="mt-3 bg-gray-100 p-3 rounded-lg">
                      <p>
                        <strong>{t("Emotion")}:</strong>{" "}
                        <span className="text-indigo-600">
                          {results[entry.id].emotion_label}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        {t("Confidence")}:{" "}
                        {(results[entry.id].confidence * 100).toFixed(2)}%
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <button
                    className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded shadow"
                    onClick={() => {
                      setDeleteId(entry.id);
                      setShowModal(true);
                    }}
                  >
                    {t("Delete")}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        {/* DELETE MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6 animate-fadeIn">
              <h2 className="text-xl font-bold mb-2">
                {t("Delete Confirmation")}
              </h2>

              <p className="mb-4">
                {t("Are you sure you want to delete this journal entry? This action cannot be undone.")}
              </p>

              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 rounded border hover:bg-gray-100"
                  onClick={() => setShowModal(false)}
                >
                  {t("Cancel")}
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={handleDelete}
                >
                  {t("Delete")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Index;
