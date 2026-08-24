import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, ShoppingBag, Send, X } from 'lucide-react';

type StorePost = {
  id: string;
  title: string;
  description: string;
  contact: string;
  category?: 'handcrafts' | 'material' | 'idle_items';
  imageDataUrl?: string;
  createdAt: string;
};

type FeedbackModal = {
  type: 'success' | 'warning';
  title: string;
  message: string;
};

const LEGACY_STORAGE_KEY = 'store_posts';
const APPROVED_STORAGE_KEY = 'store_posts_approved';
const PENDING_STORAGE_KEY = 'store_posts_pending_review';
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const readStorePosts = (key: string): StorePost[] => {
  const raw = localStorage.getItem(key);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as StorePost[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    localStorage.removeItem(key);
    return [];
  }
};

const fileToDataUrl = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
  reader.onerror = () => reject(new Error('file_read_failed'));
  reader.readAsDataURL(file);
});

const Store = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<StorePost[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contact: '',
    category: '',
    imageDataUrl: '',
  });
  const [imageError, setImageError] = useState('');
  const [selectedPost, setSelectedPost] = useState<StorePost | null>(null);
  const [feedbackModal, setFeedbackModal] = useState<FeedbackModal | null>(null);

  const selectedPostIndex = selectedPost
    ? posts.findIndex((post) => post.id === selectedPost.id)
    : -1;

  useEffect(() => {
    const approved = readStorePosts(APPROVED_STORAGE_KEY);

    if (approved.length > 0) {
      setPosts(approved);
      return;
    }

    // One-time migration for older direct-publish data.
    const legacy = readStorePosts(LEGACY_STORAGE_KEY);
    if (legacy.length > 0) {
      localStorage.setItem(APPROVED_STORAGE_KEY, JSON.stringify(legacy));
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      setPosts(legacy);
    }
  }, []);

  useEffect(() => {
    if (!selectedPost && !feedbackModal) {
      document.body.style.overflow = '';
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (selectedPost) {
          setSelectedPost(null);
        }

        if (feedbackModal) {
          setFeedbackModal(null);
        }
        return;
      }

      if (!selectedPost) {
        return;
      }

      if (event.key === 'ArrowRight') {
        setSelectedPost((current) => {
          if (!current || posts.length === 0) {
            return current;
          }

          const currentIndex = posts.findIndex((post) => post.id === current.id);
          if (currentIndex === -1) {
            return current;
          }

          return posts[(currentIndex + 1) % posts.length];
        });
        return;
      }

      if (event.key === 'ArrowLeft') {
        setSelectedPost((current) => {
          if (!current || posts.length === 0) {
            return current;
          }

          const currentIndex = posts.findIndex((post) => post.id === current.id);
          if (currentIndex === -1) {
            return current;
          }

          return posts[(currentIndex - 1 + posts.length) % posts.length];
        });
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [feedbackModal, posts, selectedPost]);

  const showPreviousPost = () => {
    if (selectedPostIndex === -1 || posts.length === 0) {
      return;
    }

    setSelectedPost(posts[(selectedPostIndex - 1 + posts.length) % posts.length]);
  };

  const showNextPost = () => {
    if (selectedPostIndex === -1 || posts.length === 0) {
      return;
    }

    setSelectedPost(posts[(selectedPostIndex + 1) % posts.length]);
  };

  const handleChange = (field: 'title' | 'description' | 'contact' | 'category' | 'imageDataUrl', value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setImageError(t('store.form.image_invalid_type'));
      event.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError(t('store.form.image_too_large'));
      event.target.value = '';
      return;
    }

    try {
      const imageDataUrl = await fileToDataUrl(file);
      setImageError('');
      handleChange('imageDataUrl', imageDataUrl);
    } catch {
      setImageError(t('store.form.image_read_error'));
    }
  };

  const clearImage = () => {
    setImageError('');
    handleChange('imageDataUrl', '');
  };

  const openFeedbackModal = (type: FeedbackModal['type'], title: string, message: string) => {
    setFeedbackModal({ type, title, message });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = formData.title.trim();
    const description = formData.description.trim();
    const contact = formData.contact.trim();

    if (!title || !description || !contact) {
      openFeedbackModal(
        'warning',
        t('store.form.missing_required_title'),
        t('store.form.missing_required_message')
      );
      return;
    }

    const nextPost: StorePost = {
      id: `store-${Date.now()}`,
      title,
      description,
      contact,
      category: formData.category ? formData.category as StorePost['category'] : undefined,
      imageDataUrl: formData.imageDataUrl || undefined,
      createdAt: new Date().toISOString(),
    };

    const pending = readStorePosts(PENDING_STORAGE_KEY);
    const nextPending = [nextPost, ...pending];
    localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(nextPending));

    setFormData({
      title: '',
      description: '',
      contact: '',
      category: '',
      imageDataUrl: '',
    });
    setImageError('');
    openFeedbackModal(
      'success',
      t('store.form.submit_pending_title'),
      t('store.form.submit_pending_success')
    );
  };

  return (
    <div className="container mx-auto px-4 py-12 lg:py-16">
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-3 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 mb-6">
          <ShoppingBag className="w-4 h-4" />
          <span>{t('store.badge')}</span>
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-5">{t('store.title')}</h1>
        <p className="text-lg text-gray-600 leading-8 max-w-2xl">{t('store.intro')}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[380px_minmax(0,1fr)] items-start">
        <section className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-6 md:p-8 lg:sticky lg:top-24">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">{t('store.publish_title')}</h2>
            <p className="text-sm text-gray-500 leading-6">{t('store.publish_description')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="store-title" className="block text-sm font-medium text-gray-700 mb-2">
                {t('store.form.title_label')}
              </label>
              <input
                id="store-title"
                type="text"
                value={formData.title}
                onChange={(event) => handleChange('title', event.target.value)}
                placeholder={t('store.form.title_placeholder')}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
              />
            </div>

            <div>
              <label htmlFor="store-description" className="block text-sm font-medium text-gray-700 mb-2">
                {t('store.form.description_label')}
              </label>
              <textarea
                id="store-description"
                value={formData.description}
                onChange={(event) => handleChange('description', event.target.value)}
                placeholder={t('store.form.description_placeholder')}
                rows={5}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100 resize-none"
              />
            </div>

            <div>
              <label htmlFor="store-contact" className="block text-sm font-medium text-gray-700 mb-2">
                {t('store.form.contact_label')}
              </label>
              <input
                id="store-contact"
                type="text"
                value={formData.contact}
                onChange={(event) => handleChange('contact', event.target.value)}
                placeholder={t('store.form.contact_placeholder')}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
              />
            </div>

            <div>
              <label htmlFor="store-category" className="block text-sm font-medium text-gray-700 mb-2">
                {t('store.form.category_label')}
              </label>
              <select
                id="store-category"
                value={formData.category}
                onChange={(event) => handleChange('category', event.target.value)}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100 bg-white"
              >
                <option value="">{t('store.form.category_placeholder')}</option>
                <option value="handcrafts">{t('store.categories.handcrafts')}</option>
                <option value="material">{t('store.categories.material')}</option>
                <option value="idle_items">{t('store.categories.idle_items')}</option>
              </select>
            </div>

            <div>
              <label htmlFor="store-image" className="block text-sm font-medium text-gray-700 mb-2">
                {t('store.form.image_label')}
              </label>
              <input
                id="store-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 file:mr-3 file:rounded-xl file:border-0 file:bg-amber-100 file:px-3 file:py-2 file:text-amber-700 file:font-medium hover:file:bg-amber-200"
              />
              <p className="text-xs text-gray-500 mt-2">{t('store.form.image_hint')}</p>
              {imageError ? <p className="text-xs text-red-500 mt-2">{imageError}</p> : null}
              {formData.imageDataUrl ? (
                <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50/40 p-3">
                  <img
                    src={formData.imageDataUrl}
                    alt={t('store.form.image_preview_alt')}
                    className="h-36 w-full rounded-xl object-cover border border-amber-100"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="mt-3 text-xs text-gray-600 underline-offset-2 hover:underline"
                  >
                    {t('store.form.image_remove')}
                  </button>
                </div>
              ) : null}
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              <Send className="w-4 h-4" />
              <span>{t('store.form.submit')}</span>
            </button>
          </form>
        </section>

        <section>
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{t('store.feed_title')}</h2>
              <p className="text-sm text-gray-500 mt-2">{t('store.feed_description')}</p>
            </div>
            <span className="text-sm text-gray-400">{posts.length} {t('store.count_suffix')}</span>
          </div>

          {posts.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-gray-200 bg-gray-50/70 px-8 py-16 text-center">
              <p className="text-xl font-medium text-gray-700 mb-2">{t('store.empty_title')}</p>
              <p className="text-sm text-gray-500">{t('store.empty_description')}</p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="rounded-[28px] border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md cursor-pointer"
                >
                  {post.imageDataUrl ? (
                    <img
                      src={post.imageDataUrl}
                      alt={post.title}
                      className="mb-5 h-44 w-full rounded-2xl object-cover border border-amber-100"
                    />
                  ) : null}
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
                      {post.category ? t(`store.categories.${post.category}`) : t('store.uncategorized')}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{post.title}</h3>
                  <p className="text-sm leading-6 text-gray-600 whitespace-pre-line mb-5 min-h-[120px]">
                    {post.description}
                  </p>
                  <div className="pt-4 border-t border-amber-100">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">{t('store.contact_label')}</p>
                    <p className="text-sm font-medium text-gray-700 break-words">{post.contact}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <AnimatePresence>
        {selectedPost ? (
          <motion.div
            key={selectedPost.id}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-md p-4 md:p-8"
            onClick={() => setSelectedPost(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {posts.length > 1 ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showPreviousPost();
                }}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 p-3 text-gray-700 shadow-lg transition hover:bg-white hover:text-gray-900"
                aria-label="Show previous card"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            ) : null}

            <motion.div
              className="relative h-[80vh] w-[80vw] max-w-6xl overflow-hidden rounded-[32px] bg-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
            >
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                className="absolute right-5 top-5 z-10 rounded-full bg-white/90 p-2 text-gray-600 shadow-sm transition hover:bg-white hover:text-gray-900"
                aria-label="Close preview"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid h-full overflow-y-auto lg:grid-cols-[1.1fr_0.9fr]">
                <div className="bg-amber-50/50 p-6 md:p-8 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-amber-100 min-h-[280px]">
                  {selectedPost.imageDataUrl ? (
                    <img
                      src={selectedPost.imageDataUrl}
                      alt={selectedPost.title}
                      className="max-h-full w-full rounded-[24px] border border-amber-100 object-contain bg-white"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-[24px] border border-dashed border-amber-200 bg-white text-sm text-gray-400">
                      {t('store.empty_image')}
                    </div>
                  )}
                </div>

                <div className="flex flex-col p-6 md:p-8 lg:p-10">
                  <div className="flex items-start justify-between gap-4 mb-6 pr-10">
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 border border-amber-100">
                      {selectedPost.category ? t(`store.categories.${selectedPost.category}`) : t('store.uncategorized')}
                    </span>
                    <span className="text-sm text-gray-400 shrink-0">
                      {new Date(selectedPost.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5">
                    {selectedPost.title}
                  </h3>

                  <div className="flex-1 overflow-y-auto pr-1">
                    <p className="text-base md:text-lg leading-8 text-gray-600 whitespace-pre-line mb-8">
                      {selectedPost.description}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-amber-100 pt-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">{t('store.contact_label')}</p>
                    <p className="text-base font-medium text-gray-700 break-words">{selectedPost.contact}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {posts.length > 1 ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showNextPost();
                }}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 p-3 text-gray-700 shadow-lg transition hover:bg-white hover:text-gray-900"
                aria-label="Show next card"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {feedbackModal ? (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/35 backdrop-blur-md p-4"
            onClick={() => setFeedbackModal(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <motion.div
              className="w-full max-w-lg rounded-[28px] bg-white shadow-2xl border border-gray-100 overflow-hidden"
              onClick={(event) => event.stopPropagation()}
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <div className={`px-6 py-5 border-b ${
                feedbackModal.type === 'success'
                  ? 'bg-emerald-50 border-emerald-100'
                  : 'bg-amber-50 border-amber-100'
              }`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className={`text-xl font-bold ${
                      feedbackModal.type === 'success' ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                      {feedbackModal.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFeedbackModal(null)}
                    className="rounded-full bg-white/90 p-2 text-gray-500 shadow-sm transition hover:text-gray-900"
                    aria-label="Close message"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="px-6 py-6">
                <p className="text-base leading-7 text-gray-600">
                  {feedbackModal.message}
                </p>
              </div>

              <div className="px-6 pb-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setFeedbackModal(null)}
                  className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold text-white transition ${
                    feedbackModal.type === 'success'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-amber-500 hover:bg-amber-600'
                  }`}
                >
                  {t('store.form.feedback_confirm')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default Store;
