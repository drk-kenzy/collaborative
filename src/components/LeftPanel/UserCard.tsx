import { memo } from 'react';
import { User } from '../../types';

// Inject keyframes once at module level (not inside React render)
if (typeof document !== 'undefined' && !document.head.querySelector('[data-anim-usercard]')) {
  const s = document.createElement('style');
  s.setAttribute('data-anim-usercard', '');
  s.textContent = `
    @keyframes writingBounce {
      0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
      40% { transform: translateY(-3px); opacity: 1; }
    }
    @keyframes countPulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.25); }
      100% { transform: scale(1); }
    }
  `;
  document.head.appendChild(s);
}

interface UserCardProps {
  user: User;
}

const UserCard = memo(({ user }: UserCardProps) => {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '9px 12px', borderRadius: 10, marginBottom: 6,
      background: user.status === 'writing' ? `${user.color}11` : 'transparent',
      border: `1px solid ${user.status === 'writing' ? user.color + '44' : '#1e293b'}`,
      boxShadow: user.status === 'writing' ? `0 0 12px ${user.color}22` : 'none',
      transition: 'all 0.3s ease',
    }}>
      {/* Avatar */}
      <div style={{
        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
        background: `linear-gradient(135deg, ${user.color}cc, ${user.color}66)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 800, color: 'white',
        boxShadow: user.status === 'writing' ? `0 0 10px ${user.color}66` : `0 0 0 2px ${user.color}33`,
        transition: 'box-shadow 0.3s',
      }}>
        {user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12, fontWeight: 700, color: '#e2e8f0',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
        }}>
          {user.name}
        </div>

        <div style={{ marginTop: 3 }}>
          {user.status === 'writing' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    display: 'inline-block', width: 4, height: 4,
                    borderRadius: '50%', background: user.color,
                    animation: `writingBounce 1s ${i * 0.15}s ease-in-out infinite`,
                  }} />
                ))}
              </div>
              <span style={{ fontSize: 10, color: user.color, fontWeight: 600 }}>
                En train d'écrire
              </span>
            </div>
          ) : (
            <span style={{ fontSize: 10, color: '#334155' }}>Inactif</span>
          )}
        </div>
      </div>

      {/* Ops counter — no key trick, just animate via CSS */}
      <div style={{ textAlign: 'center', flexShrink: 0 }}>
        <div style={{
          fontSize: 17, fontWeight: 900, color: user.color, lineHeight: 1,
          animation: 'countPulse 0.3s ease-out',
          animationPlayState: 'running',
        }}>
          {user.ops}
        </div>
        <div style={{
          fontSize: 8, color: '#334155', textTransform: 'uppercase',
          letterSpacing: 0.8, marginTop: 1
        }}>ops</div>
      </div>
    </div>
  );
});

export default UserCard;
