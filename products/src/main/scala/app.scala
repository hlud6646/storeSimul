import Database.{assignProductToSupplier, getSupplierIds, writeNewProduct}
import org.apache.commons.math3.distribution.ExponentialDistribution
import java.sql.{Connection, DriverManager, ResultSet}

object Main extends App {

  val SECONDS_PER_MINUTE = 60
  var waitTime: Int = 0

  val host = sys.env.getOrElse("POSTGRES_HOST", "store-db")
  val port = sys.env.getOrElse("POSTGRES_PORT", "5432")
  val dbName = sys.env.getOrElse("POSTGRES_DB", "store")
  val username = sys.env.getOrElse("POSTGRES_USER", "storesimul")
  val password = sys.env.getOrElse("POSTGRES_PASSWORD", "secret")

  val url = s"jdbc:postgresql://$host:$port/$dbName"
  val connection = DriverManager.getConnection(url, username, password)

  while (true) {
    try {
      val newProductId = writeNewProduct(connection)
      val supplierIds = getSupplierIds(connection)
      if (supplierIds.nonEmpty) {
        val numSuppliers = util.Random.nextInt(3) + 1
        val randomSuppliers = util.Random.shuffle(supplierIds).take(numSuppliers)
        for (supplierId <- randomSuppliers) {
          assignProductToSupplier(connection, newProductId, supplierId)
        }
      }
      waitTime =
        new ExponentialDistribution(1 * SECONDS_PER_MINUTE).sample().toInt * 10
      Thread.sleep(waitTime)
    } catch {
      case e: Exception => e.printStackTrace()
      println("Closing connection.")
      connection.close()
    }
  }
}
