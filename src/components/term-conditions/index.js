import React from "react";
import { Modal } from "antd";
import styled from "styled-components";
import { mediaQuery } from "../../styles/constants";

export default (props) => (
  <ContainerModal
    visible={props.activeModalTyC}
    onCancel={() => props.setActiveModalTyC(!props.activeModalTyC)}
    footer={false}
    onOk={() => props.setActiveModalTyC(!props.activeModalTyC)}
  >
    <div className="container-term-and-conditions">
      <p className="MsoNormal" align="center" style={{ textAlign: "center" }}>
        <b style={{ msoBidiFontWeight: "normal" }}>
          <span style={{ fontSize: "14.0pt", lineHeight: "115%" }}>
            Términos y Condiciones
          </span>
        </b>
      </p>
      <p className="MsoNormal">
        <b>
          Lea atentamente estos Términos de servicio y nuestra Política de
          privacidad antes de utilizar los Servicios de Bombo Peru S.A.C.
          (Bombo).
        </b>
      </p>
      <p className="MsoNormal">
        Al usar nuestros servicios, ya sea como invitado, como usuario
        registrado o de otra manera, acepta que estos Términos de servicio
        regirán su relación con Bombo. Si no está completamente de acuerdo con
        estos Términos de servicio, entonces no debe usar ninguno de nuestros
        Servicios.
        <br />
        <br />
        Bombo no está respaldado, directamente afiliado, mantenido o patrocinado
        por Apple Inc, Electronic Arts, Activision Blizzard, Take-Two
        Interactive, Microsoft, Xbox, Sony, Playstation o Epic Games. Todo el
        contenido, los títulos de los juegos, los nombres comerciales y / o la
        imagen comercial, las marcas comerciales, las ilustraciones y las
        imágenes asociadas son marcas comerciales y / o material con copyright
        de sus respectivos propietarios. Lea estos Términos de servicio y
        nuestra Política de privacidad cuidadosamente antes de usar los
        Servicios de Bombo Peru S.A.C. (Bombo).
      </p>
      <p className="MsoNormal">
        <b>Propiedad y licencia limitada:</b>
      </p>
      <p className="MsoNormal">
        1. Los Servicios son propiedad o tienen licencia de Bombo, y están
        protegidos por los Derechos de propiedad intelectual y otras leyes de
        derechos de propiedad. Bombo se reserva todos los derechos, títulos e
        intereses sobre los Servicios, incluidos, entre otros, todos los
        Derechos de propiedad intelectual y otros derechos de propiedad, que no
        se le otorgan explícitamente en estos Términos. Su uso permitido de los
        Servicios está limitado por los Derechos de propiedad intelectual de
        Bombo. 2. Sujeto a su acuerdo y al cumplimiento continuo de estos
        Términos de Servicio y cualquier otra política relevante de Bombo, Bombo
        le otorga una licencia limitada no comercial, no exclusiva,
        intransferible, revocable y sujeta a las limitaciones de estos Términos,
        para acceder y utilizar los Servicios para sus propios fines de
        entretenimiento. Usted acepta que no usará los Servicios para ningún
        otro propósito. Usted reconoce que para que Bombo le brinde Servicios,
        también es necesario brindarle funcionalidades relacionadas, tales como
        análisis, medición, personalización de anuncios, procesamiento de
        transacciones financieras, prevención de fraude, controles de identidad,
        medidas de seguridad, marketing y atención al cliente. 3. Limitaciones
        de la licencia. Cualquier uso de los Servicios en violación de la ley,
        estos Términos de servicio o estas Limitaciones de licencia está
        estrictamente prohibido, y puede resultar en la revocación inmediata de
        su licencia limitada a criterio exclusivo de Bombo, o puede estar sujeto
        a responsabilidad por violaciones de la ley. Usted reconoce que no
        directa o indirectamente: a. Participar en cualquier actividad o acción
        que Bombo considere que va en contra del espíritu o la intención de los
        Servicios; b. Copiar, modificar, editar, crear trabajos derivados de,
        mostrar públicamente, realizar públicamente, republicar, transmitir o
        distribuir cualquier material obtenido a través de los Servicios; c.
        Arrendar, vender, alquilar o explotar de otro modo con fines comerciales
        cualquier parte de los Servicios, incluido, entre otros, el acceso o uso
        de los Servicios; d. Eliminar, alterar u ocultar cualquier derecho de
        propiedad intelectual u otros avisos de derechos de propiedad de las
        copias de los materiales de los Servicios; e. Intentar hostigar,
        amenazar, intimidar, avergonzar, abusar o dañar, o defender o incitar el
        hostigamiento, abuso o daño de otra persona, grupo, Bombo o Afiliados de
        Bombo; f. Organizar o participar en cualquier actividad o grupo que sea
        odioso, dañino u ofensivo hacia una raza, orientación sexual o
        preferencias, religión, herencia o nacionalidad, discapacidad u otra
        clase de salud, género, edad o clases similares determinadas por Bombo;
        g. Iniciar, ayudar o involucrarse en cualquier forma de ataque o
        interrupción de los Servicios, incluida, entre otras, la distribución de
        un virus, gusano, spyware, bombas de tiempo, datos corruptos, ataques de
        denegación de servicio a los Servicios u otros intentos de interrumpir
        los Servicios o el uso o disfrute de los Servicios por parte de otra
        persona; h. Usar robots, arañas, rastreadores, software
        man-in-the-middle o cualquier otro proceso automatizado para acceder,
        usar, realizar ingeniería inversa o manipular los Servicios, Cuentas o
        Bombo; i. Uso de servicios de acceso para obtener, generar o inferir
        cualquier información comercial sobre Bombo o Afiliados de Bombo,
        incluida, entre otras, información sobre ventas o ingresos, personal,
        grupo técnico o estadísticas sobre usuarios; j. Promover, alentar o
        participar en cualquier actividad que implique piratería, phishing,
        distribución de servicios falsificados, o aprovechando o creando
        exploits, trampas, errores, errores o características indocumentadas,
        excepto con el único propósito de notificar privada y directamente Bombo
        k. Poner a disposición a través de los Servicios cualquier material o
        información que infrinja cualquier Derecho de propiedad intelectual,
        derecho de privacidad, derecho de publicidad u otro derecho de cualquier
        persona o entidad o suplante a cualquier otra persona, incluidos, entre
        otros, celebridades y empleados de Bombo; l. Intentar obtener acceso no
        autorizado a Servicios o Cuentas que no le pertenecen; m. Utilice los
        Servicios donde esté prohibido por ley. 4. Cuentas: a. Cada cuenta solo
        puede ser utilizada por una persona. Debe tomar todas las medidas
        necesarias para proteger el secreto de su información de inicio de
        sesión. Su cuenta puede ser cancelada si alguien más la usa. Debe
        notificar de inmediato a Bombo sobre cualquier uso no autorizado de su
        Cuenta o cualquier otra violación de seguridad. Bombo no será
        responsable ante usted por cualquier pérdida o daño que resulte que una
        persona no autorizada acceda a su Cuenta. b. Bombo puede eliminar
        permanentemente las Cuentas que se consideren inactivas. Las cuentas se
        considerarán inactivas cuando no se hayan utilizado durante ciento
        ochenta (180) días. c. Usted reconoce que si se elimina su Cuenta,
        entonces puede perder el acceso a cualquier información asociada con esa
        Cuenta. Si desea eliminar su cuenta, avise a Bombo enviando un aviso al
        siguiente contacto: info@bombo.com d. No importa lo que se diga en estos
        Términos o en cualquier otro lugar dentro de los Servicios, usted
        reconoce expresamente que no tiene ningún derecho, título o interés
        sobre ninguna Cuenta que cree a través de nuestros Servicios, y su
        Cuenta no es de su propiedad. Su cuenta es propiedad de Bombo y tiene
        una licencia limitada para usted según las mismas reglas que 2 y 3.
      </p>

      <p>
        <b>Tarifas y condiciones de pago:</b>
      </p>

      <p>
        1. Dentro de los Servicios, puede participar en torneos basados en
        honorarios y competiciones cara a cara en ciertos juegos competitivos
        basados en habilidades multijugador (un "Partido"). El ganador de cada
        partida estará determinado por su habilidad en relación con otros
        usuarios que compitan en el mismo torneo o partida cara a cara. 2.
        Además de cumplir con el requisito de edad para acceder a los Servicios
        debe tener al menos la edad legal mínima requerida por el estado en el
        que reside para poder participar en dichos Partidos. Si su estado de
        residencia no permite que se jueguen juegos basados en habilidades por
        dinero en efectivo o premios, no debe participar en dichos partidos.
        Bombo puede en cualquier momento solicitarle que presente pruebas de
        elegibilidad para participar en un Match o retirar fondos. 3. El costo
        de entrada y el valor de los precios ofrecidos en cada partido se
        divulgarán antes del comienzo de cada partido. Al remitir la tarifa de
        inscripción para cualquier Match, usted acepta y reconoce que cualquier
        tarifa de inscripción pagada no es reembolsable y que no puede ganar el
        Match. Al comienzo del partido, las tarifas de inscripción pagadas se
        cargarán a su método de pago en el archivo. Usted es el único
        responsable del pago de las tarifas de entrada. 4. Después del partido,
        incluso si el partido se cierra prematuramente, los usuarios informarán
        los resultados del partido a Bombo dentro de los servicios. Bombo tendrá
        la discreción única y absoluta para determinar los resultados y
        ganadores del partido, y al participar en cualquier partido, usted
        acepta estar sujeto a estas determinaciones. Después de que Bombo haya
        determinado el ganador del Partido, Bombo retendrá una tarifa del quince
        por ciento (15%) de todos los montos ganados por el ganador del Partido,
        y luego los fondos restantes del premio se acreditarán en la cuenta o se
        remitirán al Partido ganador. 5. TODOS LOS CARGOS INCURRIDOS EN RELACIÓN
        CON LOS SERVICIOS SE PAGAN POR ADELANTADO, FINAL, Y NO SON REEMBOLSABLES
        EN TODO O EN PARTE, POR CUALQUIER MOTIVO, EXCEPTO LO REQUERIDO POR LA
        LEY APLICABLE DE DERECHOS DEL CONSUMIDOR EN SU JURISDICCIÓN LOCAL. NO
        RECIBIRÁ DINERO U OTRA COMPENSACIÓN POR ARTÍCULOS VIRTUALES NO
        UTILIZADOS CUANDO SE CIERRE UNA CUENTA, SI TAL CIERRE FUE VOLUNTARIO O
        INVOLUNTARIO.
      </p>
      <p>
        <b>Contenido del usuario:</b>
      </p>
      <p>
        1. En la medida máxima permitida por la ley, Bombo no asume ninguna
        responsabilidad u obligación por la conducta de cualquier usuario que
        envíe cualquier Contenido de usuario, y no asume ninguna responsabilidad
        u obligación por la preselección o monitoreo de los Servicios por
        contenido o conducta inapropiada o ilegal. No podemos evaluar
        previamente o monitorear todo el Contenido del usuario y no lo haremos.
        El uso de los Servicios es bajo su propio riesgo, y usted es el único
        responsable de cualquier Contenido de usuario que publique. 2. Cuando
        transmite o carga Contenido de usuario, acepta cumplir con las
        siguientes reglas: a. Todo el contenido será preciso, completo y libre
        de fraude y engaño; b. Todo el contenido estará libre de cualquier
        infracción de los derechos de propiedad intelectual; c. Todo el
        contenido no debe ser amenazante, acosar o promover el racismo, la
        intolerancia, el odio o el daño físico de ningún tipo contra ningún
        grupo o individuo o promover o alentar la violencia o actividades
        ilegales; d. Todo el contenido cumplirá con estos Términos de servicio;
        e. Todo el contenido no violará ninguna ley, restricciones contractuales
        o derechos de terceros; f. Todo el contenido estará libre de virus,
        adware, spyware, gusanos u otro código malicioso; g. Todo el contenido
        estará libre de spam, solicitudes comerciales, cadenas de cartas y
        correos masivos. 3. Todo el Contenido del usuario que publique será
        considerado no confidencial. Bombo solo compartirá la información
        personal que usted proporcione de acuerdo con la Política de privacidad.
        Bombo no es responsable del uso o apropiación de ningún otro usuario o
        de terceros del Contenido de usuario que haya enviado a través de los
        Servicios. 4. Por la presente, otorga a Bombo una licencia mundial no
        exclusiva, irrevocable, perpetua, transferible, totalmente pagada, libre
        de regalías (incluido el derecho de sublicenciar y ceder a terceros) y
        el derecho de usar, copiar, reproducir, cotizar, volver a publicar,
        corregir, imprimir, archivar, almacenar, modificar, adaptar, crear
        trabajos derivados, fabricar, comercializar, publicar, distribuir,
        vender, licenciar, sublicenciar, sindicar, transferir, traducir,
        arrendar, transmitir, exhibir públicamente, realizar públicamente, o
        proporcionar acceso para transmitir, comunicar, comunicarse
        electrónicamente al público por telecomunicación, realizar, ingresar en
        la memoria de la computadora y practicar, de cualquier manera, su
        Contenido de Usuario, o cualquier parte del mismo, de cualquier manera o
        forma en cualquier medio o formato, ya sea ahora conocido o ideado en el
        futuro, así como todos los trabajos modificados y derivados de los
        mismos en relación con nuestra prestación de los Servicios, incluidos el
        marketing y las promociones de los Servicios, y sin previo aviso, pago o
        atribución de ningún tipo a usted o cualquier otro tercera p
        pretensioso. En consecuencia, usted otorga a Bombo y a las Afiliadas de
        Bombo todas las licencias, consentimientos y autorizaciones necesarias
        para permitir que Bombo use el Contenido del usuario para dichos fines.
        Por la presente, también otorga a Bombo el derecho de autorizar a otros
        a ejercer cualquiera de los derechos otorgados a Bombo en virtud de esta
        Sección. Además, le otorga a Bombo el derecho incondicional e
        irrevocable de usar y explotar su nombre, imagen y cualquier otra
        información o material incluido en cualquier Contenido de usuario y en
        relación con cualquier Contenido de usuario, sin ninguna obligación
        hacia usted. Salvo que lo prohíba la ley, renuncia a cualquier derecho
        de atribución y / o cualquier derecho moral que pueda tener sobre su
        Contenido de usuario, independientemente de si su Contenido de usuario
        se modifica o modifica de alguna manera. Bombo no reclama ningún derecho
        de propiedad sobre su Contenido de usuario y nada en estos Términos de
        servicio tiene la intención de restringir los derechos que pueda tener
        para usar y explotar su Contenido de usuario. 5. En cumplimiento de la
        Ley de Derechos de Autor Digital Millennium y otras leyes aplicables
        similares o equivalentes, si se notifica a Bombo que usted ha infringido
        los derechos de autor u otros Derechos de Propiedad Intelectual de
        otros, su acceso a los Servicios puede cancelarse sin previo aviso a tú.
        Si cree que su contenido ha sido infringido en los Servicios,
        notifíquenoslo enviando un correo electrónico a la siguiente dirección:
        help@playerslounge.co. Tenga en cuenta que si a sabiendas tergiversa la
        infracción de derechos de autor, puede ser responsable de los daños,
        incluidos los costos y los honorarios de los abogados. Los avisos
        enviados a Bombo bajo esta disposición deben incluir: a. Una descripción
        de los Derechos de Propiedad Intelectual alegados que se han infringido;
        b. Una descripción del material que se afirma que infringe; c. Su
        nombre, dirección postal, número de teléfono y dirección de correo
        electrónico; d. Una declaración suya de que: (1) cree de buena fe que se
        ha producido una infracción de los Derechos de Propiedad Intelectual
        aquí; y (2) la información en esta notificación es precisa y, bajo pena
        de perjurio, está autorizado a actuar en nombre del propietario de los
        Derechos de Propiedad Intelectual que supuestamente se han infringido; y
        e. Una firma física o electrónica de una persona autorizada para actuar
        en nombre del propietario de los Derechos de Propiedad Intelectual
        presuntamente infringidos.
      </p>

      <p>
        <b>Término:</b>
      </p>

      <p>
        1. A menos que sea modificado o modificado por Bombo, este acuerdo y sus
        disposiciones permanecerán vigentes. La terminación de cualquier
        licencia otorgada por Bombo bajo este acuerdo no afecta ninguna otra
        disposición de este acuerdo.
      </p>

      <p>
        <b>Acceso a la cuenta y asignación permitida:</b>
      </p>

      <p>
        1. Al utilizar los Servicios, usted garantiza y declara que tiene al
        menos 18 años de edad y que es legalmente competente para leer,
        comprender y aceptar las disposiciones de este acuerdo. Si es menor de
        18 años, no debe usar ninguna parte de los Servicios, crear una Cuenta o
        enviar información personal a Bombo a través de los Servicios. 2. Si se
        le ha prohibido previamente el uso de cualquiera de los Servicios de
        Bombo, entonces no puede usar nuestros Servicios. 3. Solo puede tener
        una cuenta. Si se descubre que ha registrado varias Cuentas, está
        compartiendo Cuentas con otra persona, o está accediendo a los Servicios
        a través de una cuenta que no es suya, se cancelarán todas las Cuentas
        afectadas por dicho uso, y todas las ganancias de Match asociadas con
        eso la cuenta puede ser incautada por Bombo. 4. Si usted es un padre y
        cree que su hijo puede haber creado una cuenta, contáctenos con los
        detalles de esa cuenta en info@bombo.com para eliminarla.
      </p>

      <p>
        <b>Disponibilidad y terminación del servicio:</b>
      </p>

      <p>
        1. Usted reconoce que: a. Bombo puede, a su exclusivo y absoluto
        criterio, proporcionar enmiendas, versiones, mejoras, modificaciones,
        actualizaciones o parches posteriores relacionados con cualquier parte
        de los Servicios; b. Bombo tiene la absoluta y exclusiva discreción de
        rescindir o restringir de inmediato el acceso a los Servicios, o
        cualquier parte de los Servicios, incluidas todas y cada una de las
        Cuentas y todos los fondos relacionados con su Cuenta en cualquier
        momento, por cualquier motivo, sin previo aviso y sin responsabilidad
        para con usted; c. El acceso a los Servicios puede ser interrumpido por
        razones dentro o fuera del control de Bombo, y que Bombo no puede y no
        garantiza que podrá utilizar los Servicios cuando lo desee; d. Bombo
        puede no ofrecer los Servicios en todos los países o ubicaciones
        geográficas; e. Usted es el único responsable de cualquier conexión a
        Internet y tarifas móviles en las que pueda incurrir como resultado del
        uso de nuestros Servicios.
      </p>

      <p>
        <b>Garantía y responsabilidad</b>
      </p>
      <p>
        USTED RECONOCE QUE BOMBO Y BOMBO AFILIADOS NO SON RESPONSABLES (1) POR
        CUALQUIER DAÑO INDIRECTO, INCIDENTAL, ESPECIAL, EJEMPLAR O CONSECUENTE,
        INCLUYENDO LA PÉRDIDA DE BENEFICIOS, FONDOS DE COMERCIO O DATOS, DE
        CUALQUIER FORMA QUE SURJA DEL USO O LA INCAPACIDAD DE USAR EL SERVICIO;
        O (2) PARA LA CONDUCTA DE TERCEROS, INCLUIDOS OTROS USUARIOS DEL
        SERVICIO Y OPERADORES DE SITIOS EXTERNOS. BOMBO LE OFRECE LOS SERVICIOS
        "TAL CUAL" Y "SEGÚN DISPONIBILIDAD". BOMBO NO OFRECE GARANTÍAS O
        REPRESENTACIONES DE NINGÚN TIPO, EXPRESAS O IMPLÍCITAS, EN CUANTO A LA
        OPERACIÓN DE LOS SERVICIOS, A MENOS QUE ESTAS GARANTÍAS U OTROS DERECHOS
        ESTATUTARIOS DEL CONSUMIDOR SON LEGALMENTE INCAPACIENTES DE EXCLUSIÓN O
        LIMITACIÓN EN SU JURISDICCIÓN LOCAL. EL RIESGO DE UTILIZAR LOS SERVICIOS
        SE ENCUENTRA TOTALMENTE CON USTED COMO EL RIESGO DE LESIONES DE LOS
        SERVICIOS. EN LA MEDIDA MÁXIMA PERMITIDA POR LEY, BOMBO RENUNCIA A TODAS
        LAS GARANTÍAS, EXPRESAS O IMPLÍCITAS, INCLUIDAS, SIN LIMITACIÓN, LAS
        GARANTÍAS IMPLÍCITAS DE COMERCIABILIDAD Y APTITUD PARA UN PROPÓSITO EN
        PARTICULAR. BOMBO NO GARANTIZA QUE LOS SERVICIOS ESTÁN LIBRES DE VIRUS U
        OTROS COMPONENTES DAÑINOS. EN LA MEDIDA MÁXIMA PERMITIDA POR CUALQUIER
        LEY QUE APLIQUE, LAS DESCARGAS DE RESPONSABILIDAD EN ESTOS TÉRMINOS SE
        APLICAN A TODOS LOS DAÑOS O LESIONES CAUSADAS POR LOS SERVICIOS, O
        RELACIONADOS CON EL USO O LA INCAPACIDAD DE USAR LOS SERVICIOS, BAJO
        CUALQUIER CAUSA DE ACCIÓN EN CUALQUIER CAUSA JURISDICCIÓN, INCLUIDAS,
        SIN LIMITACIÓN, ACCIONES POR INCUMPLIMIENTO DE GARANTÍA, INCUMPLIMIENTO
        DE CONTRATO O TORTURA (INCLUYENDO NEGLIGENCIA). EN LA MEDIDA MÁXIMA
        PERMISIBLE BAJO LAS LEYES APLICABLES, LA RESPONSABILIDAD AGREGADA DE LOS
        AFILIADOS DE BOMBO Y / O BOMBO QUE SURJAN O EN RELACIÓN CON ESTE ACUERDO
        NO EXCEDERÁ LAS CANTIDADES TOTALES QUE HA PAGADO (SI CUALQUIERA) A BOMBO
        Y / O BOMBO AFI / BOMBO AFI / BOMBO AFI / BOMBO AFI CIENTO OCHENTA DÍAS
        (180) DÍAS INMEDIATAMENTE ANTES DE LA FECHA EN LA QUE PRIMERO ASISTE
        CUALQUIER RECLAMACIÓN. SI NO HA PAGADO BOMBO O CUALQUIER BOMBO AFILIADO
        CUALQUIER CANTIDAD EN LOS CIENTOS OCHO DÍAS (180) DÍAS INMEDIATAMENTE
        PREVIANDO LA FECHA EN LA QUE PRIMERO ASISTE CUALQUIER RECLAMACIÓN, SU
        ÚNICA Y EXCLUSIVA SOLUCIÓN PARA CUALQUIER DISPUTA CON BOMBO Y / O BOMBO
        AFILIATE ES DEJAR DE USAR EL SERVICIO Y CANCELAR SU CUENTA. USTED
        REPRESENTA Y GARANTIZA QUE NO ESTÁ UBICADO EN UN PAÍS QUE ESTÁ SUJETO A
        UN EMBARGO DEL GOBIERNO DE LOS ESTADOS UNIDOS, O QUE HA SIDO DESIGNADO
        POR EL GOBIERNO DE LOS ESTADOS UNIDOS, Y QUE NO ESTÁ EN LA LISTA DE
        NINGÚN GOBIERNO DE LOS ESTADOS UNIDOS LISTA DE PARTES PROHIBIDAS O
        RESTRINGIDAS. ALGUNOS ESTADOS, PAÍSES O JURISDICCIONES NO PERMITEN LA
        EXCLUSIÓN DE CIERTAS GARANTÍAS, O LA EXCLUSIÓN O LIMITACIÓN DE
        RESPONSABILIDAD POR DAÑOS CONSECUENTES O INCIDENTALES. EN DICHOS
        ESTADOS, PAÍSES O JURISDICCIONES, BOMBO Y BOMBO AFILIADOS SE LIMITARÁN
        AL MÁXIMO PERMISO BAJO LAS LEYES APLICABLES, SUJETO A CUALQUIER LEY
        APLICABLE DE DERECHOS DE CONSUMIDOR ESTATUTARIOS EN SU JURISDICCIÓN
        LOCAL.
        <br />
        <br />
        Indemnización
        <br />
        <br />
        1. Usted acepta defender, indemnizar y eximir de responsabilidad a
        Bombo, a los Afiliados de Bombo y a terceros en virtud de un acuerdo con
        Bombo, y cualquier empleado, contratista, vendedor, agente, proveedor,
        licenciatario, cliente, distribuidor, accionista, director o funcionario
        de cualquiera de los anteriores, así como de cualquier persona que
        utilice los Servicios y cualquier persona o entidad que tenga
        conocimiento de su uso de los Servicios en cualquier momento, con
        respecto a todos y cada uno de los reclamos, responsabilidades, juicios,
        premios, lesiones, daños, pérdidas, costos, honorarios o gastos
        (incluidos, entre otros, los honorarios y costos de abogados) que surjan
        de, de forma directa o indirecta, de o de cualquier manera, se
        relacionan con: a. Su incumplimiento de cualquier disposición de estos
        Términos de servicio; b. Su uso de los Servicios, incluidas, entre
        otras, consideraciones económicas, físicas, emocionales, psicológicas o
        relacionadas con la privacidad; y c. Sus acciones para afectar a
        sabiendas los Servicios a través de cualquier bloatware, malware, virus
        informático, gusano, troyano, spyware, adware, crimeware, scareware,
        rootkit o cualquier otro programa instalado de una manera que el código
        ejecutable de cualquier programa esté programado para utilizar o utiliza
        ciclos de procesador durante períodos de tiempo cuando dicho programa no
        se está utilizando directa o indirectamente. 2. Bombo y las Afiliadas de
        Bombo se reservan el derecho, pero no la obligación, a su cargo, de
        asumir la defensa y el control exclusivos de cualquier asunto sujeto a
        indemnización por su parte. 3. Usted reconoce y acepta que Bombo no
        tiene la obligación de defenderlo, indemnizarlo o exonerarlo de ninguna
        manera relacionada con este acuerdo, incluido, entre otros, su uso de
        los Servicios, el uso de los Servicios por parte de cualquier persona, o
        cualquier conexión entre lo anterior y cualquier otra persona o entidad
        que tenga conocimiento de su uso de los Servicios en cualquier momento.
        4. Esta Sección sobrevivirá a la terminación de este acuerdo. La
        resolución de conflictos: 1. Resolución informal. Con respecto a
        cualquier conflicto, usted acepta intentar negociar la resolución de
        cualquier conflicto de manera informal durante al menos treinta (30)
        días antes de iniciar cualquier arbitraje u otro procedimiento, incluido
        cualquier procedimiento legal en el tribunal o ante una agencia
        administrativa. Dichas negociaciones informales comienzan con la
        recepción de la Notificación de Bombo por su parte a info@bombo.com o
        por nuestras redes sociales.
        <br />
        <br />
        <b>Varios:</b>
        <br />
        <br />
        1. Sitio web no relacionado con juegos de apuestas. No se permite el
        juego dentro de los Servicios. Los torneos habilitados a través de los
        Servicios utilizan juegos basados en habilidades, lo que significa que
        el resultado de todos los juegos relevantes se basa predominantemente en
        la habilidad de los participantes del partido, no en el azar. Bombo no
        tiene conocimiento de la probabilidad de que un participante en
        particular gane un partido, y no hace declaraciones sobre las
        posibilidades de ganar de un usuario individual. 2. En caso de una
        disputa con respecto al resultado de un Partido, Bombo puede solicitar
        que los participantes del Partido proporcionen evidencia adicional, que
        incluye, entre otros, evidencia de foto o video de los resultados del
        Partido a través del sitio web de Bombo. Si cree que ha habido un error
        con respecto a cualquier distribución de ganancias o retiros de su
        cuenta, envíenos un correo electrónico a: info@bombo.com. Bombo se
        reserva el derecho de, a su exclusivo criterio, evaluar una multa y
        cancelar su Cuenta. Si las ganancias se acreditan por error en una
        Cuenta, Bombo puede deducirlas automáticamente de su Cuenta al descubrir
        dicho error. 3. Es su responsabilidad leer, comprender y aceptar este
        acuerdo en relación con su uso de los Servicios. Usted reconoce que
        Bombo puede hacer cambios a estos Términos de servicio en cualquier
        momento, y que los títulos de las secciones de este acuerdo son solo
        para fines de conveniencia. A menos que Bombo indique lo contrario,
        cualquier cambio en estos Términos será efectivo cuando se publique. Si
        continúa utilizando los Servicios después de que se publiquen los
        cambios, acepta que esos cambios se aplicarán a su uso continuado de los
        Servicios. Debe consultar esta página regularmente para mantenerse
        informado sobre cualquier cambio. 4. Acuerdo completo. Este acuerdo: (1)
        es el acuerdo final y completo y la comprensión de las partes con
        respecto al tema del presente, y reemplaza y reemplaza todos y cada uno
        de los acuerdos y entendimientos anteriores y contemporáneos con
        respecto a los mismos; (2) no puede ser modificado, enmendado ni
        modificado de ninguna manera por usted, excepto según lo autorizado en
        un escrito firmado por los agentes autorizados de ambas partes; (3) no
        es asignable, excepto a un sucesor en interés de sustancialmente todos
        los negocios o activos de una parte y cualquier otro intento de asignar
        o transferir este acuerdo o cualquier interés en este documento es nulo;
        y (4) será vinculante y redundará en beneficio de las partes del
        presente, sus respectivos herederos, ejecutores, administradores,
        sucesores, representantes personales, licenciatarios y cesionarios. 5.
        Fuerza mayor. Ninguna de las partes será responsable de los retrasos o
        fallas en el desempeño que resulten de actos fuera del control razonable
        de dicha parte, incluyendo guerra, terrorismo, actos de enemigos
        públicos, huelgas u otros disturbios laborales, fallas de energía,
        incendios, inundaciones, terremotos, actos de Dios y otros desastres
        naturales. 6. Ningún acto o incumplimiento de Bombo se considerará una
        renuncia a cualquier derecho contenido en este acuerdo, y cualquier
        renuncia de Bombo debe ser por escrito y firmada por un oficial de
        Bombo. Si Bombo renuncia expresamente a cualquier disposición de este
        acuerdo, dicha exención no será una exención de ninguna otra disposición
        de este acuerdo, y la disposición exenta no se eximirá para siempre en
        el futuro. 7. Si se determina que alguna disposición o sub-disposición
        de este acuerdo es inválida o inaplicable, el resto se aplicará de la
        manera más completa posible y la disposición o sub-disposición no
        ejecutable se considerará modificada en la medida limitada requerida
        para permitir su ejecución de una manera que represente más
        estrechamente la intención de las partes como se expresa en este
        documento. 8. Usted reconoce y acepta que cualquier violación o amenaza
        de violación de este acuerdo causará una lesión irreparable a Bombo, lo
        que le da derecho a solicitar una medida cautelar sin la necesidad de
        probar daños reales, además de todos los demás recursos legales o de
        equidad. Usted reconoce específicamente que los daños monetarios por sí
        solos serían un remedio inadecuado para las lesiones y daños que
        sufriría e incurriría Bombo como resultado del incumplimiento de
        cualquiera de las disposiciones de este acuerdo. 9. No hay relaciones de
        controlador conjunto. Nada en este acuerdo, la política de privacidad o
        cualquier documento tiene la intención, o se considerará, de establecer
        una relación de controlador conjunto bajo el Reglamento General de
        Protección de Datos (y leyes similares) entre Bombo y sus socios,
        usuarios de API, SDK y sitios o aplicaciones a los que vinculamos.
      </p>
      <p className="MsoNormal">
        <b>Partidas falsas:</b>
      </p>
      <p className="MsoNormal">
        Si se encuentra en el historial, que un usuario ha realizado partidas
        con cuentas creadas el mismo día, o cuentas realizadas con correos
        temporales y sin número telefónico registrado. Además, si han jugado
        únicamente contra ese tipo de usuarios o algún otro indicador que los
        moderadores consideren sospechoso se procederá a la sanción económica o
        baneo de la cuenta sin lugar a reclamos.
      </p>
      <p className="MsoNormal">
        <b>Cupones:</b>
      </p>
      <p className="MsoNormal">
        Los cupones de promoción enviados por correo electrónico son para uso
        exclusivo de la cuenta registrada. A menos que el correo confirme que es
        válido para compartir en su red de contactos. En caso de alguna
        actividad sospechosa, se procederá con lo mencionado en la claúsula de
        partidas falsas.
      </p>
    </div>
  </ContainerModal>
);

const ContainerModal = styled(Modal)`
  background: ${(props) => props.theme.basic.blackDarken} !important;
  width: 94% !important;
  top: 10px;
  ${mediaQuery.afterTablet} {
    width: 70% !important;
  }
  .ant-modal-close {
    color: ${(props) => props.theme.basic.white} !important;
  }
  .ant-modal-content {
    background: ${(props) => props.theme.basic.blackDarken}; !important;
    .ant-modal-body {
      background: ${(props) => props.theme.basic.blackDarken} !important;
      margin-bottom: 1rem;
      ${mediaQuery.afterTablet} {
        margin-bottom: 0;
      }
      .container-term-and-conditions {
        color: ${(props) => props.theme.basic.white};
      }
    }
  }
`;
