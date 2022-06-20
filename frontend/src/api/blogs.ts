import instance from '.';
export const getBlogs = async () => {
    const response = await instance.get('https://swapi.dev/api/people')
    const data = response?.data;
    return data?.results as any[];
}