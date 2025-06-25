#!/bin/bash
set -e

# If the data directory is not initialized (by checking for the 'base' subdirectory), initialize it.
if [ ! -d "/var/lib/postgresql/data/base" ]; then
    echo "Initializing PostgreSQL database..."
    # Debian uses a different data directory structure
    mkdir -p /var/lib/postgresql/data
    chown -R postgres:postgres /var/lib/postgresql/data
    
    # Initialize DB
    su - postgres -c "/usr/lib/postgresql/15/bin/initdb -D /var/lib/postgresql/data"

    # Allow connections from any host
    echo "host all all 0.0.0.0/0 scram-sha-256" >> /var/lib/postgresql/data/pg_hba.conf
    echo "host all all ::/0 scram-sha-256" >> /var/lib/postgresql/data/pg_hba.conf

    # Start postgres to run init scripts
    su - postgres -c "/usr/lib/postgresql/15/bin/pg_ctl -D /var/lib/postgresql/data -o \"-c listen_addresses='*'\" -w start"

    # Create user and database. Make storesimul the owner.
    # This will solve the permission denied error.
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
        CREATE USER storesimul WITH PASSWORD 'secret';
        CREATE DATABASE store OWNER storesimul;
        ALTER USER storesimul WITH SUPERUSER;
EOSQL

    # Run custom init scripts
    for f in /docker-entrypoint-initdb.d/*; do
        case "$f" in
            *.sh)     echo "$0: running $f"; . "$f" ;;
            *.sql)    echo "$0: running $f"; psql -v ON_ERROR_STOP=1 -U storesimul -d store -f "$f";;
            *.sql.gz) echo "$0: running $f"; gunzip -c "$f" | psql -v ON_ERROR_STOP=1 -U storesimul -d store;;
            *)        echo "$0: ignoring $f" ;;
        esac
    done

    # Stop postgres
    su - postgres -c "/usr/lib/postgresql/15/bin/pg_ctl -D /var/lib/postgresql/data -w stop"
fi

# Start PostgreSQL in the foreground
exec su - postgres -c "/usr/lib/postgresql/15/bin/postgres -D /var/lib/postgresql/data -c listen_addresses='*'" 