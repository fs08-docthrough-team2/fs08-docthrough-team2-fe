import PostHeader from '@/components/organisms/PostHeader/PostHeader';

const PostLayout = ({ children }) => {
  return (
    <>
      <PostHeader />
      {children}
    </>
  );
};

export default PostLayout;
