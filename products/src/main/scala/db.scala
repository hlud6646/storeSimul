import Product._

import java.sql.{Connection, DriverManager, ResultSet}
import org.slf4j.LoggerFactory

object Database {
  val logger = LoggerFactory.getLogger(Main.getClass)
  val url = "jdbc:postgresql://localhost:5432/storesimul"
  val username = "storesimuladmin"

  def writeNewProduct() = {

    var connection: Connection = null

    try {
      connection = DriverManager.getConnection(url, username, "")
      val statement = connection.createStatement()
      val sql =
        "INSERT INTO product (name, material, color, department) VALUES (?, ?, ?, ?)"
      val preparedStatement = connection.prepareStatement(sql)

      val product = Product.random()
      preparedStatement.setString(1, product.name)
      preparedStatement.setString(2, product.material)
      preparedStatement.setString(3, product.color)
      preparedStatement.setString(4, product.department)

      val rowsInserted = preparedStatement.executeUpdate()
      if (rowsInserted > 0) {
        logger.info(s"New product: $product")
      }
    } catch {
      case e: Exception => e.printStackTrace()
    } finally {
      if (connection != null) {
        connection.close()
      }
    }
  }
}
