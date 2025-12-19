namespace Data.Interfaces
{
    public interface IGenericRepository<T> where T : class
    {
        #region Chỉ sử dụng cho QueryString
        IQueryable<T> Entities { get; }
        IQueryable<T> GetAll();
        #endregion

        Task<IEnumerable<T>> GetAllAsync();
        Task<T?> GetByIdAsync(object id);
        Task AddAsync(T entity);
        Task AddRangeAsync(IEnumerable<T> entities);
        Task UpdateAsync(T entity);
        Task UpdateRangeAsync(IEnumerable<T> entities);
        Task DeleteAsync(T entity);
        Task DeleteRangeAsync(IEnumerable<T> entities);
    }
}
