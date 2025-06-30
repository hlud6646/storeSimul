{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE RecordWildCards #-}

module Main where

import Control.Concurrent (threadDelay)
import Control.Monad (void)
import Data.ByteString (ByteString)
import Data.ByteString.Char8 (pack)
import Data.Int (Int64)
import Data.Maybe (fromMaybe)
import Data.Text (Text)
import Database.PostgreSQL.Simple
import Database.PostgreSQL.Simple.FromRow (field, fromRow)
import Database.PostgreSQL.Simple.ToField (toField)
import Database.PostgreSQL.Simple.ToRow (toRow)
import Faker
import qualified Faker.Address as FAddress
import qualified Faker.Company as FCompany
import qualified Faker.Name as FName
import qualified Faker.PhoneNumber as FPhone
import Statistics.Distribution (ContGen (genContVar))
import Statistics.Distribution.Exponential (exponential)
import System.Environment (getEnv, lookupEnv)
import System.Log.FastLogger
import System.Random (StdGen, newStdGen, randomRIO, randomRs)
import System.Random.MWC (GenIO, createSystemRandom)

-- Data types.
data Supplier = Supplier
  { supplier_name :: Text,
    address :: Text,
    phone :: Text,
    email :: Text
  }
  deriving (Show)

data Product = Product
  { product_name :: Text,
    material :: Text,
    color :: Text,
    department :: Text
  }

data SupplierProduct = SupplierProduct
  { supplier_id :: Int,
    product_id :: Int,
    price :: Int
  }

-- Fake data generation for suppliers.
fakeSupplier :: Fake Supplier
fakeSupplier = do
  supplier_name <- FCompany.name
  address <- FAddress.fullAddress
  phone <- FPhone.cellPhoneFormat
  email <- FCompany.email
  pure $ Supplier {..}

-- Database instances and connection config.
instance FromRow Product where
  fromRow = Product <$> field <*> field <*> field <*> field

instance ToRow Supplier where
  toRow Supplier {..} = [toField supplier_name, toField address, toField phone, toField email]

instance ToRow SupplierProduct where
  toRow SupplierProduct {..} = [toField supplier_id, toField product_id, toField price]

-- postgresql://[user[:password]@][host][:port][/dbname][?param1=value1&...]
getConnectionString :: IO ByteString
getConnectionString = do
  pgUser <- lookupEnv "POSTGRES_USER"
  pgPassword <- lookupEnv "POSTGRES_PASSWORD"
  pgHost <- lookupEnv "POSTGRES_HOST"
  pgPort <- lookupEnv "POSTGRES_PORT"
  pgDatabase <- lookupEnv "POSTGRES_DB"

  let user = fromMaybe "storesimul" pgUser
      password = fromMaybe "secret" pgPassword
      host = fromMaybe "localhost" pgHost
      port = fromMaybe "5432" pgPort
      database = fromMaybe "storesimul" pgDatabase

  return $
    pack $
      "postgresql://"
        ++ user
        ++ ":"
        ++ password
        ++ "@"
        ++ host
        ++ ":"
        ++ port
        ++ "/"
        ++ database

-- Insert a random supplier and return the new id.
writeNewSupplier :: Connection -> IO Int
writeNewSupplier conn = do
  supplier <- generateNonDeterministic fakeSupplier
  [Only id] <-
    query
      conn
      "INSERT INTO supplier (name, address, phone, email) \
      \ VALUES (?, ?, ?, ?) \
      \ RETURNING id"
      supplier
  return id

-- Pull 20 random product ids from the database.
readRandomProducts :: Connection -> IO [Int]
readRandomProducts conn = do
  ids <- query_ conn "SELECT id FROM product ORDER BY RANDOM() LIMIT 20"
  return $ map fromOnly ids

-- Function to generate a random price between a given range.
generateRandomPrice :: IO Int
generateRandomPrice = randomRIO (100, 1000000) -- Adjust the range as needed.

writeSupplierProducts :: Connection -> Int -> [Int] -> IO ()
writeSupplierProducts conn supplierID productIds = do
  supplierProducts <-
    mapM
      (\productId -> SupplierProduct (fromIntegral supplierID) productId <$> generateRandomPrice)
      productIds
  void $
    executeMany
      conn
      "INSERT INTO supplier_products (supplier_id, product_id, price) VALUES (?, ?, ?)"
      supplierProducts

-- Sleep for a random amount of time.
sleep :: IO ()
sleep = do
  gen <- createSystemRandom
  let dist = exponential 1
  waitTime <- genContVar dist gen
  rate <- read <$> getEnv "SUPPLIER_RATE"
  threadDelay (round (waitTime * rate))
  return ()

-- Log the new supplier.
logSupplier :: Int -> IO ()
logSupplier supplier = do
  timeCache <- newTimeCache simpleTimeFormat'
  (logger, cleanup) <- newTimedFastLogger timeCache (LogFileNoRotate "suppliers.log" defaultBufSize)
  let msg = "New supplier with ID " <> show supplier <> "\n" :: String
  putStr msg
  logger $ \time -> toLogStr time <> " - " <> toLogStr msg
  cleanup

loop :: Connection -> IO ()
loop conn =
  do
    supplierID <- writeNewSupplier conn
    productIds <- readRandomProducts conn
    writeSupplierProducts conn supplierID productIds
    logSupplier supplierID
    sleep
    loop conn

main :: IO ()
main = do
  connectionUrl <- getConnectionString
  conn <- connectPostgreSQL connectionUrl
  loop conn

-- TODO: Does this close the connection properly?
