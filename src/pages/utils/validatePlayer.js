//agregar las validaciones de entrar a una partida /torneo

/*

if (!authUser) return setIsVisibleLoginModal(true);

    if (
      !get(
        authUser,
        `userAccounts.${get(requiredUserAccount, "id", null)}`,
        null
      )
    )
      return setIsVisibleModalUserAccount(true);

    if (!get(authUser, "phoneNumber")) {
      props.showNotification(
        "Complete sus datos",
        "Por favor complete su número de teléfonico."
      );
      return history.push("/profile#settings");
    }

    const entryCost = +get(tournament, "entryCost", 0);

    if (
      get(tournament, "realMoney", true) &&
      get(authUser, "money", 0) < entryCost
    )
      return props.showNotification(
        "Dinero insufiente",
        "Para poder inscribirte al torneo debes recargar."
      );

    if (
      !get(tournament, "realMoney", true) &&
      get(authUser, "ebCoins", 0) < entryCost
    )
      return props.showNotification(
        "Dinero jugable insufiente",
        "Para poder inscribirte al torneo debes conseguir mas dinero jugable."
      );
      
*/
