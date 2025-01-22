import Database.writeNewProduct
import org.apache.commons.math3.distribution.ExponentialDistribution
import java.sql.{Connection, DriverManager, ResultSet}

object Main extends App {

  val SECONDS_PER_MINUTE = 60
  var waitTime: Int = 0

  val host = sys.env.getOrElse("DB_HOST", "store-db")
  val port = sys.env.getOrElse("DB_PORT", "5432")
  val dbName = sys.env.getOrElse("DB_NAME", "storesimul")
  val username = sys.env.getOrElse("DB_USER", "storesimul")
  val password = sys.env.getOrElse("DB_PASSWORD", "secret")

  val url = s"jdbc:postgresql://$host:$port/$dbName"
  val connection = DriverManager.getConnection(url, username, password)

  while (true) {
    try {
      writeNewProduct(connection)
      waitTime =
        ExponentialDistribution(1 * SECONDS_PER_MINUTE).sample().toInt * 1000
      Thread.sleep(waitTime)
    } catch {
      case e: Exception => e.printStackTrace()
      println("Closing connection.")
      connection.close()
    }
  }
}
