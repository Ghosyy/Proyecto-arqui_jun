import pymysql

sql_path = r"C:\Users\abner\OneDrive\Escritorio\arqui_projeclel\ms-productos\productos-seed.sql"
with open(sql_path, "r", encoding="utf-8") as f:
    sql_content = f.read()

conn = pymysql.connect(
    host="127.0.0.1",
    port=3306,
    user="root",
    password="",
    database="ecommerce_productos",
    autocommit=True
)

with conn.cursor() as cur:
    # Ensure table exists first if synchronize hasn't run yet
    cur.execute("""
    CREATE TABLE IF NOT EXISTS productos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        codigo VARCHAR(255) NOT NULL UNIQUE,
        nombre VARCHAR(255) NOT NULL,
        descripcion TEXT NULL,
        precio DECIMAL(10,2) NOT NULL,
        existencia INT NOT NULL,
        categoria VARCHAR(255) NOT NULL,
        estado ENUM('DISPONIBLE', 'AGOTADO', 'DESCONTINUADO') NOT NULL DEFAULT 'DISPONIBLE'
    );
    """)
    # Extract only the INSERT statement
    for stmt in sql_content.split(";"):
        stmt = stmt.strip()
        if stmt and not stmt.startswith("--") and not stmt.startswith("USE"):
            cur.execute(stmt)

    cur.execute("SELECT COUNT(*) AS total, GROUP_CONCAT(codigo SEPARATOR ', ') AS codigos FROM productos")
    res = cur.fetchone()
    print("Productos sembrados en MySQL (ecommerce_productos):", res[0])
    print("Códigos:", res[1])

conn.close()
