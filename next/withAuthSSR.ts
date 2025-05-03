import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { verifyToken } from '../server/token';

export function withAuthSSR<P extends { [key: string]: any }>(
  getServerSideProps?: GetServerSideProps<P>
): GetServerSideProps<P> {
  return async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const { req, res } = context;
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    try {
      const user = verifyToken(token);
      
      if (getServerSideProps) {
        // Add user to context for the wrapped getServerSideProps
        (context as any).user = user;
        return await getServerSideProps(context);
      }

      return {
        props: { user } as P,
      };
    } catch (error) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
  };
}
