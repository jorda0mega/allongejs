describe("Allonge", function(){
  describe("unary", function(){
    it("returns 'why'", function(){
      expect(unary("why", "hello", "there")).toEqual("why");
    });
  });

  describe("binary", function(){
    it("returns ['hello', 'there']", function(){
      expect(binary("why","hello","there")).toEqual(["why","hello"]);
    });
  });

  describe("variadic unary", function(){
    it("returns ['why', 'hello', 'there']", function(){
      expect(variadic(unary)("why", "hello", "there")).toEqual(["why", "hello", "there"]);
    });
  });

  describe("variadic binary", function(){
    it("returns ['why', ['hello', 'there']]", function(){
      expect(variadic(binary)("why","hello","there")).toEqual(["why",["hello","there"]]);
    });
  });
});
