import { connect } from "@/dbConfig/dbConfig"; //for checking for DB connectivity
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

import { getDataFromToken } from "@/helpers/getDataFromToken";
// connected to db
connect();
export async function POST(request: NextRequest) {
  //extract data from token
  const userId = await getDataFromToken(request);
  const user = await User.findOne({ _id: userId }).select("-password"); // password will not be fetched
  // check for no user
  return NextResponse.json({ message: "User Found", data: user });
}
