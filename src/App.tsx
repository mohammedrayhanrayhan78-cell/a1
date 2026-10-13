import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Circle, Flame, Heart, Sparkles, Stamp, Sun } from 'lucide-react';
import { Button, buttonClass } from './components/Button';
import { ChallengeArt } from './components/ChallengeArt';
import {
  challenges,
  currentDaily,
  dateKey,
  emptyState,
  readState,
  saveState,
  secondsToMidnight,
  stampToday,
  swapChallenge,
  toggleStamp,
  weekDates,
  type Category,
  type ClubState,
} from './lib/a1';

const nav = [
  { title: 'How it works', id: 'how-it-works' },
  { title: 'Challenge wall', id: 'challenge-wall' },
  { title: 'Streak', id: 'streak' },
  { title: 'The crew', id: 'crew' },
];
const crew = [
  { name: 'Miko Kanz', initials: 'MK', streak: 31 },
  { name: 'Sepideh Pasah', initials: 'SP', streak: 18 },
  { name: 'Sara Ilyas', initials: 'SI', streak: 9 },
];
const wallBriefs = [
  'A little geometry. A lot of personality.',
  'Make your name a symbol, not a word.',
  'Four colors. Zero playing it safe.',
  'Three triangles. One memorable mark.',
  'Say something good. In just two words.',
  'Let a single splash of color do the talking.',
];
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function StarMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path className="fill-ink" d="m12 2 2.7 6.4 6.9.6-5.2 4.5 1.6 6.8-6-3.6-6 3.6 1.6-6.8L2.4 9l6.9-.6z" />
    </svg>
  );
}

export default function App() {
  const [state, setState] = useState<ClubState>(emptyState);
  const [now, setNow] = useState<Date | null>(null);
  const [ready, setReady] = useState(false);
  const [filter, setFilter] = useState<Category | 'All'>('All');
  const [toast, setToast] = useState(false);
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setState(readState());
    setNow(new Date());
    setReady(true);
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => {
      clearInterval(interval);
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
    };
  }, []);
  useEffect(() => {
    if (ready) saveState(state);
  }, [state, ready]);

  const daily = now ? currentDaily(state.daily, now) : { date: '', index: 0, swapped: false };
  const challenge = challenges[daily.index] ?? challenges[0];
  const seconds = now ? secondsToMidnight(now) : 0;
  const clock = [Math.floor(seconds / 3600), Math.floor((seconds % 3600) / 60), seconds % 60];
  const todayKey = now ? dateKey(now) : '';
  const stamped = state.stamps.includes(todayKey);
  const days = now ? weekDates(now) : [];
  const weekCount = days.filter((day) => state.stamps.includes(dateKey(day))).length;

  function complete() {
    if (!now) return;
    setState((prev) => ({ ...prev, stamps: stampToday(prev.stamps, now) }));
    setToast(true);
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setToast(false), 2400);
  }
  function another() {
    if (!now) return;
    setState((prev) => ({ ...prev, daily: swapChallenge(prev.daily, now) }));
  }

  return (
    <div className="site" id="top">
      <header className="site-header shell">
        <a className="brand" href="#top" aria-label="A1 Daily club, back to top">
          <span className="logo">A1</span>
          <span>Daily club</span>
        </a>
        <nav className="header-nav" aria-label="Main navigation">
          {nav.map((item) => (
            <a className="nav-pill" key={item.id} href={`#${item.id}`}>
              {item.title}
            </a>
          ))}
        </nav>
      </header>

      <main>
        <section className="hero shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title">
              Draw one thing.
              <br />
              <span className="last-line">Every day.</span>
            </h1>
            <p>
              A1 is a pocket club for people who would rather make than scroll. Get one small design challenge each morning, finish it before midnight, and stamp it.
            </p>
            <div className="hero-actions">
              <a className={buttonClass('red')} href="#today">
                Get today's challenge <ArrowRight aria-hidden="true" />
              </a>
              <a className={buttonClass('cream')} href="#challenge-wall">
                See the wall <ArrowDown aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="ticket-wrap" id="today">
            <svg className="corner-shape corner-triangle" viewBox="0 0 100 100" aria-hidden="true">
              <path className="fill-sky ink-stroke" d="M50 6L95 90H5z" />
            </svg>
            <svg className="corner-shape corner-square" viewBox="0 0 100 100" aria-hidden="true">
              <rect className="fill-green ink-stroke" x="5" y="5" width="90" height="90" rx="3" />
            </svg>
            <svg className="spark" viewBox="0 0 70 70" aria-hidden="true">
              <path className="ink-stroke no-fill" d="M38 30L20 8m8 34L3 33m47-13L48 2" />
            </svg>
            <article className="ticket" aria-labelledby="ticket-title">
              <div className="ticket-top">
                <div className="ticket-heading">
                  <h2 id="ticket-title">Today's challenge</h2>
                  <Sun strokeWidth={2.5} aria-hidden="true" />
                </div>
                <div className="difficulty">
                  <span className="difficulty-dot" />
                  <span>{challenge.difficulty}</span>
                  <span aria-hidden="true">·</span>
                  <span>Small but mighty</span>
                </div>
              </div>
              <div className="ticket-body">
                <h3>{challenge.title}</h3>
                <p className="ticket-brief">{challenge.brief}</p>
                <div className="tag-row">
                  {challenge.tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="clock-label">A little time left to make a little thing.</p>
                <div
                  className="countdown"
                  role="timer"
                  aria-label={now ? `${clock[0]} hours, ${clock[1]} minutes, ${clock[2]} seconds until local midnight` : 'Time remaining loading'}
                  aria-live="off"
                >
                  {clock.map((value, i) => (
                    <div className="contents" key={i}>
                      {i > 0 && (
                        <span className="clock-colon" aria-hidden="true">
                          :
                        </span>
                      )}
                      <div className="clock-cell">
                        <strong>{now ? String(value).padStart(2, '0') : '–'}</strong>
                        <span>{['hours', 'minutes', 'seconds'][i]}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="ticket-actions">
                  <Button variant="mustard" onClick={complete} disabled={!ready}>
                    {stamped ? <Check aria-hidden="true" /> : <Stamp aria-hidden="true" />}
                    {stamped ? 'Day stamped!' : "I'm done!"}
                  </Button>
                  <Button variant="paper" onClick={another} disabled={!ready || daily.swapped} aria-describedby={daily.swapped ? 'swap-note' : undefined}>
                    Give me another
                  </Button>
                </div>
                {daily.swapped && (
                  <p className="swap-note" id="swap-note">
                    One swap a day. A fresh challenge arrives tomorrow.
                  </p>
                )}
              </div>
            </article>
          </div>
        </section>

        <section className="section shell" id="how-it-works" aria-labelledby="steps-title">
          <div className="section-heading">
            <h2 id="steps-title">Three steps, one stamp</h2>
            <p>
              No perfect. Just done. <Sparkles className="inline size-5" aria-hidden="true" />
            </p>
          </div>
          <ol className="steps">
            {[
              ['Pull a challenge', 'One bite-sized brief. A blank page. A place to start.'],
              ['Beat the clock', 'Make it your own before midnight. Messy counts, too.'],
              ['Stamp the day', 'Hit “I’m done!” and watch your little habit grow.'],
            ].map(([title, brief], index) => (
              <li className="step-card" key={title}>
                <span className="step-number" aria-hidden="true">
                  {index + 1}
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{brief}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="section wall-section shell" id="challenge-wall" aria-labelledby="wall-title">
          <div className="section-heading">
            <h2 id="wall-title">The challenge wall</h2>
            <div className="filters" role="group" aria-label="Filter challenges">
              {(['All', 'Shapes', 'Type', 'Color'] as const).map((category) => (
                <Button variant="pill" key={category} aria-pressed={filter === category} onClick={() => setFilter(category)}>
                  {category}
                </Button>
              ))}
            </div>
          </div>
          <div className="wall-grid">
            {challenges
              .slice(0, 6)
              .map((item, index) => ({ item, index }))
              .filter(({ item }) => filter === 'All' || item.category === filter)
              .map(({ item, index }) => (
                <article className="wall-card" data-category={item.category} key={item.title}>
                  <ChallengeArt kind={item.art} />
                  <div className="wall-card-body">
                    <h3>{item.title}</h3>
                    <p>{wallBriefs[index]}</p>
                    <span className="tag">{item.category}</span>
                  </div>
                </article>
              ))}
          </div>
        </section>

        <section className="community shell" aria-label="Your stamps and the club">
          <div className="panel" id="streak">
            <div className="panel-heading">
              <h2>Your week</h2>
              <Flame aria-hidden="true" />
            </div>
            <p>A little every day adds up to a lot.</p>
            <div className="week-grid" role="group" aria-label="This week's stamps">
              {days.map((day) => {
                const key = dateKey(day);
                const isToday = key === todayKey;
                const isStamped = state.stamps.includes(key);
                const isFuture = key > todayKey;
                return (
                  <Button
                    key={key}
                    variant="day"
                    className={`${isToday ? 'today' : ''} ${isFuture ? 'future' : ''}`}
                    aria-pressed={isStamped}
                    aria-current={isToday ? 'date' : undefined}
                    aria-label={`${day.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}, ${isStamped ? 'stamped' : 'not stamped'}`}
                    onClick={() => setState((prev) => ({ ...prev, stamps: toggleStamp(prev.stamps, key) }))}
                  >
                    <span>{weekdays[day.getDay()]}</span>
                    <span className={`day-mark ${isToday && isStamped && toast ? 'stamp-pop' : ''}`}>
                      {isStamped ? <Check strokeWidth={3} aria-hidden="true" /> : isToday ? <StarMark /> : <Circle size={14} aria-hidden="true" />}
                    </span>
                  </Button>
                );
              })}
            </div>
            <div className="week-bottom">
              <Stamp aria-hidden="true" />
              <span>{weekCount === 0 ? 'Your next stamp starts something good.' : `${weekCount} of 7 days stamped. Keep your pencil moving.`}</span>
            </div>
          </div>

          <div className="panel" id="crew">
            <div className="panel-heading">
              <h2>The crew</h2>
              <Heart aria-hidden="true" />
            </div>
            <p>Good company. Better creative habits.</p>
            <div className="crew-list">
              {crew.map((person) => {
                const following = state.follows.includes(person.name);
                return (
                  <div className="crew-person" key={person.name}>
                    <span className="avatar" aria-hidden="true">
                      {person.initials}
                    </span>
                    <div className="person-info">
                      <strong>{person.name}</strong>
                      <span>{person.streak} day streak</span>
                    </div>
                    <Button
                      variant="follow"
                      aria-label={`${following ? 'Unfollow' : 'Follow'} ${person.name}`}
                      aria-pressed={following}
                      onClick={() =>
                        setState((prev) => ({
                          ...prev,
                          follows: following ? prev.follows.filter((name) => name !== person.name) : [...prev.follows, person.name],
                        }))
                      }
                    >
                      {following ? 'Following' : 'Follow'}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="shell">
          <div className="footer-top">
            <div>
              <h2>Ready for today's?</h2>
              <p>One small thing. A little more you.</p>
            </div>
            <a href="#today" aria-label="Go to today's challenge">
              <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
          <div className="footer-bottom">
            <span>A1. Made a little better, every day.</span>
            <nav className="footer-nav" aria-label="Footer navigation">
              {nav.map((item) => (
                <a key={item.id} href={`#${item.id}`}>
                  {item.title}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </footer>
      {toast && (
        <div className="toast" role="status">
          <Check aria-hidden="true" />
          Stamped
        </div>
      )}
    </div>
  );
}
