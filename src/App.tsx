import classNames from 'classnames';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.scss';

import { useState } from 'react';
import { PostsList } from './components/PostsList';
import { PostDetails } from './components/PostDetails';
import { UserSelector } from './components/UserSelector';
import { User } from './types/User';
import { Post } from './types/Post';
import { client } from './utils/fetchClient';
import { Loader } from './components/Loader';

export const App = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isPostsLoading, setIsPostsLoading] = useState(false);
  const [hasPostsLoadingError, setHasPostsLoadingError] = useState(false);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setPosts([]);

    setIsPostsLoading(true);
    setHasPostsLoadingError(false);

    client
      .get<Post[]>(`/posts?userId=${user.id}`)
      .then(setPosts)
      .catch(() => setHasPostsLoadingError(true))
      .finally(() => setIsPostsLoading(false));
  };

  return (
    <main className="section">
      <div className="container">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box is-success">
              <div className="block">
                <UserSelector user={selectedUser} onSelect={handleUserSelect} />
              </div>

              <div className="block" data-cy="MainContent">
                {!selectedUser && (
                  <p data-cy="NoSelectedUser">No user selected</p>
                )}

                {selectedUser && isPostsLoading && <Loader />}

                {selectedUser && !isPostsLoading && hasPostsLoadingError && (
                  <div
                    className="notification is-danger"
                    data-cy="PostsLoadingError"
                  >
                    Something went wrong!
                  </div>
                )}
                {/* eslint-disable @typescript-eslint/indent */}
                {selectedUser &&
                  !isPostsLoading &&
                  !hasPostsLoadingError &&
                  posts.length === 0 && (
                    <div
                      className="notification is-warning"
                      data-cy="NoPostsYet"
                    >
                      No posts yet
                    </div>
                  )}
                {/* eslint-enable @typescript-eslint/indent */}
                {selectedUser &&
                  !isPostsLoading &&
                  !hasPostsLoadingError &&
                  posts.length > 0 && <PostsList posts={posts} />}
              </div>
            </div>
          </div>

          <div
            data-cy="Sidebar"
            className={classNames(
              'tile',
              'is-parent',
              'is-8-desktop',
              'Sidebar',
              'Sidebar--open',
            )}
          >
            <div className="tile is-child box is-success ">
              <PostDetails />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
