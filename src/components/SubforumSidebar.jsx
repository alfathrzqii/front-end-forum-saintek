import { Link } from 'react-router-dom';

export default function SubforumSidebar({ subforums }) {
  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
      <div className="bg-blue-600 p-4">
        <h2 className="text-white font-bold">Popular Subforums</h2>
      </div>
      <div className="p-2">
        {subforums.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {subforums.map((subforum) => (
              <li key={subforum.id}>
                <Link
                  to={`/subforums/${subforum.slug}`}
                  className="flex items-center p-3 hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="text-gray-900 font-medium text-sm">s/{subforum.name}</span>
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
