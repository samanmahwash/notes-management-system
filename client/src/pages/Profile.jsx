import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiFileText, FiStar, FiArchive, FiTag } from 'react-icons/fi';
import { RiPushpinFill } from 'react-icons/ri';
import StatCard from '../components/StatCard';
import { fetchProfile, updateProfile } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { formatDate, initials } from '../utils/helpers';

const Profile = () => {
  const { setUser } = useAuth();
  const [data, setData] = useState(null);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const result = await fetchProfile();
    setData(result);
    setName(result.user.name);
    setAvatar(result.user.avatar || '');
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const result = await updateProfile({ name, avatar });
      setUser(result.user);
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!data) {
    return <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-graphite">Your account and note activity.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={FiFileText} label="Total Notes" value={data.stats.totalNotes} />
        <StatCard icon={FiStar} label="Favorites" value={data.stats.favoriteNotes} accent="text-pine" />
        <StatCard icon={FiArchive} label="Archived" value={data.stats.archivedNotes} accent="text-clay" />
        <StatCard icon={RiPushpinFill} label="Pinned" value={data.stats.pinnedNotes} />
      </div>

      <div className="card p-6">
        <div className="mb-6 flex items-center gap-4">
          {avatar ? (
            <img src={avatar} alt={name} className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/20 font-mono text-xl font-semibold text-gold-dark dark:text-gold">
              {initials(name)}
            </span>
          )}
          <div>
            <p className="font-display text-lg font-medium">{data.user.name}</p>
            <p className="text-sm text-graphite">{data.user.email}</p>
            <p className="text-xs text-graphite">Joined {formatDate(data.user.createdAt)}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Avatar URL</label>
            <input
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="input-field"
              placeholder="https://…"
            />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
