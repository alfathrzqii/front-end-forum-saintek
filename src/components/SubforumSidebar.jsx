import { Link } from 'react-router-dom';

export default function SubforumSidebar({ subforums }) {
  return (
    <div className="bg-white border-2 border-plm-charcoal rounded-[32px] shadow-[6px_6px_0px_0px_rgba(33,33,33,1)] overflow-hidden">
      <div className="bg-plm-pink border-b-2 border-plm-charcoal p-5">
        <h2 className="text-plm-charcoal font-serif font-bold text-xl lowercase italic">popular clubs</h2>
      </div>
      <div className="p-4">
        {subforums.length > 0 ? (
          <ul className="space-y-2">
            {subforums.map((subforum) => (
              <li key={subforum.id}>
                <Link
                  to={`/subforums/${subforum.slug}`}
                  className="flex items-center p-3 hover:bg-plm-cream border-2 border-transparent hover:border-plm-charcoal rounded-2xl transition-all duration-200 group"
                >
                  <span className="text-plm-charcoal font-bold text-[10px] uppercase tracking-widest group-hover:translate-x-1 transition-transform">{subforum.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm p-4 italic text-center">No subforums found.</p>
        )}
      </div>
    </div>
  );
}
