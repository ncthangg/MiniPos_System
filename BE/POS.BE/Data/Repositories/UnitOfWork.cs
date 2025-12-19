using Data.Interfaces;
using Microsoft.EntityFrameworkCore.Storage;
using RentEase.Data.DBContext;

namespace Data.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DBContext _context;
        private readonly Dictionary<Type, object> _repositories = new();
        private IDbContextTransaction? _transaction;

        public UnitOfWork(DBContext context)
        {
            _context = context;
        }

        public IGenericRepository<T> GetRepository<T>() where T : class
        {
            var type = typeof(T);
            if (!_repositories.ContainsKey(type))
            {
                var repo = new GenericRepository<T>(_context);
                _repositories[type] = repo;
            }

            return (IGenericRepository<T>)_repositories[type];
        }
        //Lưu vào DB 
        public async Task<int> SaveAsync()
            => await _context.SaveChangesAsync();

        //Bắt đầu
        public async Task BeginTransactionAsync()
            => _transaction = await _context.Database.BeginTransactionAsync();

        //Thành công
        public async Task CommitTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.CommitAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        //Hoàn tác
        public async Task RollbackTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.RollbackAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public void Dispose()
        {
            _context.Dispose();
            _transaction?.Dispose();
        }
    }
}
